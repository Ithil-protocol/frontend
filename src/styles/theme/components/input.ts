import { StyleConfig } from "@chakra-ui/react";

import { palette } from "../palette";

export const ithilInputStyle: StyleConfig = {
  baseStyle: {
    field: {
      fontSize: ["20px"],
      fontWeight: "normal",
      lineHeight: "115%",
      bg: palette.primary[200],
      background: palette.primary[200],
    },
  },
};
