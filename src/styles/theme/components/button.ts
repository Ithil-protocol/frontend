import { StyleConfig } from "@chakra-ui/react";

import { palette } from "../palette";

export const ithilButtonStyle: StyleConfig = {
  variants: {
    insideInput: {
      backgroundColor: palette.primary[300],
      borderColor: palette.primary[300],
      borderWidth: "1px",
      _disabled: {
        backgroundColor: "transparent",
        borderColor: palette.primary[300],
      },
    },
    ithil: {
      backgroundColor: palette.variant.primary.action,
      color: palette.font.button,
      width: "100%",
      fontSize: "18px",
      _hover: {
        _disabled: {
          backgroundColor: "var(--button-hover-light)", //FIXME: Missing in global, where is it?
        },
      },
      _disabled: {
        backgroundColor: palette.variant.primary.disabled,
        border: `1px solid ${palette.variant.primary.border}`,
        color: palette.secondary.main,
        opacity: 1,
      },
    },
  },
  defaultProps: {
    variant: "ithil",
  },
};
