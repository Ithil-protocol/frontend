import {
  type ThemeConfig,
  extendTheme,
  withDefaultVariant,
} from "@chakra-ui/react";

import {
  ithilButtonStyle,
  ithilHeadingStyle,
  ithilInputStyle,
  ithilSkeletonStyle,
  ithilTableStyle,
  ithilTooltipStyle,
} from "./components";
import { palette } from "./palette";

export const theme: ThemeConfig = extendTheme(
  {
    colors: {
      primary: palette.primary,
      secondary: palette.secondary,
    },
    components: {
      Button: ithilButtonStyle,
      Heading: ithilHeadingStyle,
      Input: ithilInputStyle,
      Skeleton: ithilSkeletonStyle,
      Table: ithilTableStyle,
      Tooltip: ithilTooltipStyle,
    },
    fonts: {
      body: "var(--font-inter)",
      heading: "var(--font-inter)",
    },
    initialColorMode: "dark",
    styles: {
      global: {
        body: {
          background: palette.primary.main,
          color: palette.font.main,
        },
      },
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
    variant: "ithil",
    components: ["Table"],
  })
);
