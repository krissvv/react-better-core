import { API, APIConfigItem, APIEndpointConfig, APIError, APIResponse } from "../types/api";
import { AnyOtherString } from "../types/app";
import { HttpHeaders, HttpMethod } from "../types/http";

import { constructQuery, objectToFormData } from "./functions";
import { log } from "./logger";

const methodInitiateToString: Record<HttpMethod, string> = {
   GET: "GET request to      ",
   PUT: "PUT request to      ",
   POST: "POST request to     ",
   PATCH: "PATCH request to    ",
   DELETE: "DELETE request to   ",
   HEAD: "HEAD request to     ",
   OPTIONS: "OPTIONS request to  ",
   TRACE: "TRACE request to    ",
   CONNECT: "CONNECT request to  ",
};

const methodResponseToString: Record<HttpMethod, string> = {
   GET: "GET request from    ",
   PUT: "PUT request from    ",
   POST: "POST request from   ",
   PATCH: "PATCH request from  ",
   DELETE: "DELETE request from ",
   HEAD: "HEAD request from   ",
   OPTIONS: "OPTIONS request from",
   TRACE: "TRACE request from  ",
   CONNECT: "CONNECT request from",
};

export function generateApi<
   APIConfig extends Record<string, APIConfigItem>,
   APIHeaders extends HttpHeaders = HttpHeaders,
>(
   options: {
      /**
       * Do not add a trailing slash
       */
      baseUrl: string;
      getHeaders?: {
         [HeaderName in keyof APIHeaders | AnyOtherString]?: () =>
            | (HeaderName extends keyof APIHeaders ? APIHeaders[HeaderName] : string)
            | undefined;
      };
      getAdditionalHeaders?: (endpointConfig: APIEndpointConfig) => Record<string, string | undefined>;
   },
   apiConfig: API<APIConfig>,
) {
   return async function apiCall<EndpointName extends keyof APIConfig>(
      name: EndpointName,
      payload: {
         query?: APIConfig[EndpointName]["query"];
         body?: APIConfig[EndpointName]["body"];
         path?: APIConfig[EndpointName]["path"];
         headers?: HttpHeaders;
      } = {},
   ): Promise<APIResponse<APIConfig[EndpointName]["response"]>> {
      const endpointConfig = apiConfig[name];

      if (!endpointConfig) {
         return Promise.reject(
            new Error(`Endpoint ${name.toString()} is not defined in the \`generateApi\` function.`, {
               cause: "generateApi.apiConfig.missingEndpoint",
            }),
         );
      }

      const baseURL = options.baseUrl;
      const path = `${endpointConfig.path}${payload.path?.length ? `/${payload.path.join("/")}` : ""}`;
      const query = constructQuery(payload.query);
      const url = `${baseURL}${path}${query ? `?${query}` : ""}`;

      const requestHeaders: HttpHeaders = {
         ...(!endpointConfig.bodyWithFormData && !endpointConfig.responseIsOctetStream
            ? {
                 "Content-Type": "application/json",
              }
            : {}),
         ...(options.getHeaders
            ? Object.entries(options.getHeaders).reduce<HttpHeaders>((previousValue, [key, value]) => {
                 if (endpointConfig.includeHeaders?.includes(key as keyof HttpHeaders)) {
                    previousValue[key as keyof HttpHeaders] = value?.();
                 }

                 return previousValue;
              }, {})
            : {}),
         ...options.getAdditionalHeaders?.(endpointConfig),
         ...endpointConfig.headers,
         ...payload.headers,
      };

      const body = payload.body;
      const readyBody = endpointConfig.bodyWithFormData && body ? objectToFormData(body) : JSON.stringify(body ?? {});

      log.log(`Initiate ${methodInitiateToString[endpointConfig.method]} ${url} - ${name.toString()}`, {
         color: "magenta",
      });

      return await call(() =>
         fetch(url, {
            method: endpointConfig.method,
            body: endpointConfig.method !== "GET" ? readyBody : undefined,
            headers: requestHeaders as any,
         }),
      );

      async function call(
         callAction: () => Promise<Response>,
      ): Promise<APIResponse<APIConfig[EndpointName]["response"]>> {
         try {
            const response = await callAction();
            let parsedResponse;

            try {
               parsedResponse = endpointConfig.responseIsOctetStream
                  ? await response.blob()
                  : requestHeaders["Content-Type"] === "application/json"
                    ? await response.json()
                    : await response.text();
            } catch {
               parsedResponse = undefined;
            }

            if (!response.ok) {
               log.log(
                  `Failed   ${methodResponseToString[endpointConfig.method]} request to ${url} with status code: ${response.status} - ${name.toString()}`,
                  {
                     color: "red",
                  },
               );

               throw {
                  data: parsedResponse,
                  headers: response.headers,
                  statusCode: response.status,
                  statusText: response.statusText,
                  url: response.url,
                  ok: false,
                  redirected: response.redirected,
               } as APIError;
            }

            log.log(`Response ${methodResponseToString[endpointConfig.method]} ${url} - ${name.toString()}`, {
               color: "blue",
            });

            return {
               data: parsedResponse,
               headers: response.headers,
               statusCode: response.status,
               statusText: response.statusText,
               url: response.url,
               ok: response.ok,
               redirected: response.redirected,
            };
         } catch (error) {
            if (isApiError(error)) throw error;

            log.log(`Error    ${methodResponseToString[endpointConfig.method]} ${url} - ${name.toString()}`, {
               color: "red",
            });

            throw {
               data: error,
               ok: false,
            } as APIError;
         }
      }
   };
}

export function isApiError<Data = any>(error: unknown): error is APIError<Data> {
   return typeof error === "object" && error !== null && "ok" in error && error.ok === false && "data" in error;
}
