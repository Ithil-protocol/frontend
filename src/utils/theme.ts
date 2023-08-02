import { ColorMode } from "@chakra-ui/react";

export const mode = (
  colorMode: ColorMode,
  lightColor: string,
  darkColor: string
) => (colorMode === "light" ? lightColor : darkColor);
