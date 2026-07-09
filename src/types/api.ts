import { AnyOtherString } from "./app";
import { HttpHeaders, HttpMethod } from "./http";

export type API<APIConfig> = Record<keyof APIConfig, APIEndpointConfig>;

export type APIEndpointConfig = {
   method: HttpMethod;
   path: `/${string}`;
   bodyWithFormData?: boolean;
   responseIsOctetStream?: boolean;
   headers?: HttpHeaders;
   includeHeaders?: (keyof HttpHeaders | AnyOtherString)[];
   meta?: Record<string, any>;
};

export type APIConfigItem = {
   body: any;
   response: any;
   path?: (string | number)[];
   query?: UrlQuery;
};

export type UrlQuery = Record<string, string | number | boolean | (string | number)[]>;

export type APIResponse<Data = any> = {
   data: Data;
   headers: Headers;
   statusCode: number;
   statusText: string;
   url: string;
   ok: boolean;
   redirected: boolean;
};

export type APIError<Data = any> = {
   data: Data;
   headers?: Headers;
   statusCode?: number;
   statusText?: string;
   url?: string;
   ok: false;
   redirected?: boolean;
};
