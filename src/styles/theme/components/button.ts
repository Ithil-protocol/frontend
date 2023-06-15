import { StyleConfig } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

import { palette } from "../palette";

export const ithilButtonStyle: StyleConfig = {
  defaultProps: {
    variant: "ithil",
  },
  variants: {
    insideInput: ({ colorMode }) => ({
      backgroundColor: mode(
        colorMode,
        palette.primary[300],
        palette.primary["300.dark"]
      ),
      borderColor: mode(
        colorMode,
        palette.primary[300],
        palette.primary["300.dark"]
      ),
      borderWidth: "1px",
      _disabled: {
        backgroundColor: "transparent",
        borderColor: mode(
          colorMode,
          palette.primary[300],
          palette.primary["300.dark"]
        ),
      },
    }),
    ithil: ({ colorMode }) => ({
      backgroundColor: mode(
        colorMode,
        palette.variants.ithil["action"],
        palette.variants.ithil["action.dark"]
      ),
      color: mode(colorMode, palette.font.button, palette.font["button.dark"]),
      width: "100%",
      fontSize: "18px",
      _hover: {
        _disabled: {
          //FIXME: Missing in global, where is it?
          backgroundColor: "var(--button-hover-light)",
        },
      },
      _disabled: {
        backgroundColor: mode(
          colorMode,
          palette.variants.ithil.disabled,
          palette.variants.ithil["disabled.dark"]
        ),
        border: `1px solid ${mode(
          colorMode,
          palette.variants.ithil.border,
          palette.variants.ithil["border.dark"]
        )}`,
        color: mode(
          colorMode,
          palette.secondary.main,
          palette.secondary["main.dark"]
        ),
        opacity: 1,
      },
    }),
    primary: ({ colorMode }) => ({
      backgroundColor: mode(colorMode, "red", "blue"),
    }),
  },
};
