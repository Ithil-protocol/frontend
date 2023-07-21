import { useColorMode as useColorModeMain } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

export const useColorMode = () => {
  const colorModeValues = useColorModeMain();
  return {
    ...colorModeValues,
    mode: (lightColor: string, darkColor: string) =>
      mode(colorModeValues.colorMode, lightColor, darkColor),
    pickColor: (colorObject: any, value: string): string =>
      colorObject[
        colorModeValues.colorMode === "light" ? value : `${value}.dark`
      ],
  };
};
