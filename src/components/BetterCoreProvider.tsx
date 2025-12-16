import { createContext, memo, useCallback, useContext, useMemo, useState } from "react";

import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";

import { BetterCoreConfig } from "../types/config";
import { AnyOtherString, DeepPartialRecord } from "../types/app";
import { ColorTheme } from "../types/theme";
import { LoaderConfig, LoaderName } from "../types/loader";

export type BetterCoreInternalConfig = BetterCoreConfig & {
   setColorTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
   setLoaders: React.Dispatch<React.SetStateAction<Partial<LoaderConfig>>>;
};

export type BetterCoreProviderConfig = DeepPartialRecord<BetterCoreConfig>;

const betterCoreContext = createContext<BetterCoreInternalConfig | undefined>(undefined);

export let externalBetterCoreContextValue: BetterCoreInternalConfig | undefined;

export const useBetterCoreContext = (): BetterCoreConfig => {
   const context = useContext(betterCoreContext);

   if (context === undefined)
      throw new Error(
         "`useBetterCoreContext()` must be used within a `<BetterCoreProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context;
};

export const useTheme = () => {
   const context = useContext(betterCoreContext);

   if (context === undefined)
      throw new Error(
         "`useTheme()` must be used within a `<BetterCoreProvider>`. Make sure to add one at the root of your component tree.",
      );

   return {
      ...context.theme,
      colors: context.theme.colors[context.colorTheme] ?? context.theme.colors.light,
   };
};

export const useLoader = (loaderName?: LoaderName | AnyOtherString): boolean => {
   const context = useContext(betterCoreContext);

   if (context === undefined)
      throw new Error(
         "`useLoader()` must be used within a `<BetterCoreProvider>`. Make sure to add one at the root of your component tree.",
      );

   return loaderName ? context.loaders[loaderName.toString()] ?? false : false;
};

export const useLoaderControls = () => {
   const context = useContext(betterCoreContext);

   if (context === undefined)
      throw new Error(
         "`useLoaderControls()` must be used within a `<BetterCoreProvider>`. Make sure to add one at the root of your component tree.",
      );

   const startLoading = useCallback((loaderName: LoaderName | AnyOtherString) => {
      context.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: true,
      }));
   }, []);
   const stopLoading = useCallback((loaderName: LoaderName | AnyOtherString) => {
      context.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: false,
      }));
   }, []);

   return {
      startLoading,
      stopLoading,
   };
};

type BetterCoreProviderProps = {
   config?: BetterCoreProviderConfig;
   children?: React.ReactNode;
};

function BetterCoreProvider({ config, children }: BetterCoreProviderProps) {
   const [colorTheme, setColorTheme] = useState<ColorTheme>(config?.colorTheme ?? "light");
   const [loaders, setLoaders] = useState<Partial<LoaderConfig>>(config?.loaders ?? {});

   const readyConfig = useMemo<BetterCoreInternalConfig>(
      () => ({
         theme: {
            styles: {
               ...theme.styles,
               ...config?.theme?.styles,
            },
            colors: {
               light: {
                  ...theme.colors.light,
                  ...config?.theme?.colors?.light,
               },
               dark: {
                  ...theme.colors.dark,
                  ...config?.theme?.colors?.dark,
               },
            },
         },
         colorTheme,
         setColorTheme,
         icons: {
            ...icons,
            ...config?.icons,
         },
         assets: {
            ...assets,
            ...config?.assets,
         },
         loaders,
         setLoaders,
      }),
      [config, colorTheme, loaders],
   );

   externalBetterCoreContextValue = readyConfig;

   return <betterCoreContext.Provider value={readyConfig}>{children}</betterCoreContext.Provider>;
}

export default memo(BetterCoreProvider) as typeof BetterCoreProvider;
