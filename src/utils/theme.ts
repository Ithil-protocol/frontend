import { ColorMode } from "@chakra-ui/react";

export const mode = (
  colorMode: ColorMode,
  lightColor: string,
  darkColor: string
) => (colorMode === "light" ? lightColor : darkColor);

export const pickColor = (
  colorMode: ColorMode,
  colorObject: any,
  value: string
): string => colorObject[colorMode === "light" ? value : `${value}.dark`];
