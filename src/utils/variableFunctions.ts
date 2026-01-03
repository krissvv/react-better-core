import { AnyOtherString } from "../types/app";
import { LoaderName } from "../types/loader";
import { ColorTheme } from "../types/theme";

import { BetterCoreInternalConfig, externalBetterCoreContextValue } from "../components/BetterCoreProvider";

const checkBetterCoreContextValue = (
   value: BetterCoreInternalConfig | undefined,
   functionsName: string,
): value is BetterCoreInternalConfig => {
   if (value === undefined) {
      throw new Error(
         `\`${functionsName}()\` must be used within a \`<BetterCoreProvider>\`. Make sure to add one at the root of your component tree.`,
      );
   }

   return value !== undefined;
};

export const loaderControls = {
   startLoading: (loaderName: LoaderName | AnyOtherString) => {
      if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "loaderControls.startLoading")) return;

      externalBetterCoreContextValue.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: true,
      }));
   },
   stopLoading: (loaderName: LoaderName | AnyOtherString) => {
      if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "loaderControls.stopLoading")) return;

      externalBetterCoreContextValue.setLoaders((oldValue) => ({
         ...oldValue,
         [loaderName.toString()]: false,
      }));
   },
};

export const colorThemeControls = {
   toggleTheme: (theme?: ColorTheme) => {
      if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "colorThemeControls.toggleTheme")) return;

      const currentColorTheme = externalBetterCoreContextValue.colorTheme;
      const newColorTheme = theme ?? (currentColorTheme === "dark" ? "light" : "dark");

      externalBetterCoreContextValue.setColorTheme(newColorTheme);
   },
};
