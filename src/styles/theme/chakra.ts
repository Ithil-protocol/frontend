import {
  type ThemeConfig,
  extendTheme,
  withDefaultVariant,
} from "@chakra-ui/react";

import { mode } from "@/utils/theme";

import {
  buttonStyle,
  headingStyle,
  inputStyle,
  menuStyle,
  skeletonStyle,
  tableStyle,
  tooltipStyle,
} from "./components";
import { palette } from "./palette";

export const theme: ThemeConfig = extendTheme(
  {
    colors: palette.colors,
    components: {
      Button: buttonStyle,
      Heading: headingStyle,
      Input: inputStyle,
      Menu: menuStyle,
      Skeleton: skeletonStyle,
      Table: tableStyle,
      Tooltip: tooltipStyle,
    },
    fonts: {
      body: "var(--font-body)",
      heading: "var(--font-heading)",
    },
    initialColorMode: "dark",
    styles: {
      global: ({ colorMode }: any) => ({
        body: {
          background: mode(
            colorMode,
            palette.colors.primary["main"],
            palette.colors.primary["main.dark"]
          ),
          color: mode(
            colorMode,
            palette.font["main"],
            palette.font["main.dark"]
          ),
        },
      }),
    },
    textStyles: {
      lg: {
        fontSize: ["20px"],
        fontWeight: "600",
        lineHeight: "150%",
      },
      md: {
        fontSize: ["16px"],
        fontWeight: "500",
        lineHeight: "150%",
      },
      md2: {
        fontSize: ["18px"],
        fontWeight: "normal",
        lineHeight: "150%",
      },
      "slender-md": {
        fontFamily: "system-ui",
        fontSize: ["18px"],
        fontWeight: "600",
        lineHeight: "150%",
      },
      // "slender" is Poppins
      "slender-sm": {
        fontFamily: "system-ui",
        fontSize: ["14px"],
        fontWeight: "700",
        lineHeight: "150%",
      },
      "slender-sm2": {
        fontFamily: "system-ui",
        fontSize: ["14px", "14px", "16px"],
        fontWeight: "500",
        lineHeight: "150%",
      },
      sm: {
        fontSize: ["14px"],
        fontWeight: "normal",
        lineHeight: "150%",
      },
    },
    useSystemColorMode: false,
  },
  withDefaultVariant({
    variant: "",
    components: ["Table"],
  })
);
