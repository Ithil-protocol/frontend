import { StyleConfig } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

import { palette } from "../palette";

export const ithilInputStyle: StyleConfig = {
  baseStyle: {
    field: {
      fontSize: ["20px"],
      fontWeight: "normal",
      lineHeight: "115%",
    },
  },
  variants: {
    ithil: ({ colorMode }) => ({
      bg: mode(colorMode, palette.primary[200], palette.primary["200.dark"]),
      background: mode(
        colorMode,
        palette.primary[200],
        palette.primary["200.dark"]
      ),
    }),
  },
  defaultProps: {
    variant: "ithil",
  },
};
