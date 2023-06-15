import { StyleConfig } from "@chakra-ui/react";

import { palette } from "../palette";

export const ithilTableStyle: StyleConfig = {
  variants: {
    ithil: () => ({
      table: {
        backgroundColor: palette.primary[100],
        borderRadius: "12px",
        paddingTop: "20px",
      },
      th: {
        fontWeight: "normal",
        fontSize: "16px",
      },
      tr: {
        borderBottom: `1px solid ${palette.primary[200]}`,
      },
    }),
  },
};
