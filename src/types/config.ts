import { ColorTheme, ThemeConfig } from "./theme";
import { AssetsConfig } from "./asset";
import { IconsConfig } from "./icon";
import { LoaderConfig } from "./loader";

export type BetterCoreConfig = {
   theme: ThemeConfig;
   colorTheme: ColorTheme;
   icons: Partial<IconsConfig>;
   assets: Partial<AssetsConfig>;
   loaders: Partial<LoaderConfig>;
};
