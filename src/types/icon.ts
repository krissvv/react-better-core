export type IconName =
   | "XMark"
   | "trash"
   | "chevronDown"
   | "chevronLeft"
   | "chevronRight"
   | "check"
   | "infoI"
   | "warningTriangle";

export type IconData = {
   width: number;
   height: number;
   paths: (React.ComponentProps<"path"> & { type: "fill" | "stroke" })[];
};

export type IconsConfig = Record<IconName, IconData> & {
   [key: string]: IconData;
};
