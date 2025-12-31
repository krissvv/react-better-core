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

      setTimeout(() => {
         window.document.body.parentElement?.setAttribute("data-theme", newColorTheme);
         localStorage.setItem("theme", newColorTheme);
      }, 0.01 * 1000);
   },
};

export const filterHover = (): Record<"z05" | "z1" | "z2" | "z3", React.CSSProperties["filter"]> => {
   if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "filterHover")) return undefined as any;

   return {
      z05: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.2)" : "brightness(0.95)",
      z1: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.3)" : "brightness(0.9)",
      z2: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.6)" : "brightness(0.8)",
      z3: externalBetterCoreContextValue.colorTheme === "dark" ? "brightness(1.9)" : "brightness(0.7)",
   };
};
