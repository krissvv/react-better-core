import BetterCoreProvider, {
   useBetterCoreContext,
   useTheme,
   useLoader,
   useLoaderControls,
   type BetterCoreInternalConfig,
} from "./components/BetterCoreProvider";

import { countries } from "./constants/countries";

import {
   type OmitProps,
   type ExcludeOptions,
   type PickValue,
   type PartialRecord,
   type DeepPartialRecord,
   type PickAllRequired,
   type AnyOtherString,
} from "./types/app";
import { type AssetName, type AssetsConfig } from "./types/asset";
import { type BetterCoreConfig } from "./types/config";
import { type Country } from "./types/countries";
import { type IconName, type IconsConfig } from "./types/icon";
import { type LoaderName, type LoaderConfig } from "./types/loader";
import {
   type Color,
   type ColorName,
   type ColorTheme,
   type Colors,
   type Styles,
   type Theme,
   type ThemeConfig,
} from "./types/theme";

import { lightenColor, darkenColor, saturateColor, desaturateColor } from "./utils/colorManipulation";
import {
   generateRandomString,
   formatPhoneNumber,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
   getPluralWord,
} from "./utils/functions";
import { useBooleanState, useDebounceState } from "./utils/hooks";
import { loaderControls, filterHover } from "./utils/variableFunctions";

export {
   BetterCoreProvider,
   useBetterCoreContext,
   useTheme,
   useLoader,
   useLoaderControls,
   BetterCoreInternalConfig,

   // Constants
   countries,

   // Types
   OmitProps,
   ExcludeOptions,
   PickValue,
   PartialRecord,
   DeepPartialRecord,
   PickAllRequired,
   AnyOtherString,
   AssetName,
   AssetsConfig,
   BetterCoreConfig,
   Country,
   IconName,
   IconsConfig,
   LoaderName,
   LoaderConfig,
   Color,
   ColorName,
   ColorTheme,
   Colors,
   Styles,
   Theme,
   ThemeConfig,

   // Color Manipulation
   lightenColor,
   darkenColor,
   saturateColor,
   desaturateColor,

   // Functions
   generateRandomString,
   formatPhoneNumber,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
   getPluralWord,

   // Hooks
   useBooleanState,
   useDebounceState,

   // Variable Functions
   loaderControls,
   filterHover,
};
