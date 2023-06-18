import { StyleConfig } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

import { palette } from "../palette";

export const buttonStyle: StyleConfig = {
  defaultProps: {
    variant: "ithil",
  },
  variants: {
    insideInput: ({ colorMode }) => ({
      backgroundColor: mode(
        colorMode,
        palette.colors.primary[300],
        palette.colors.primary["300.dark"]
      ),
      borderColor: mode(
        colorMode,
        palette.colors.primary[300],
        palette.colors.primary["300.dark"]
      ),
      borderWidth: "1px",
      _disabled: {
        backgroundColor: "transparent",
        borderColor: mode(
          colorMode,
          palette.colors.primary[300],
          palette.colors.primary["300.dark"]
        ),
      },
    }),
    ithil: ({ colorMode }) => ({
      backgroundColor: mode(
        colorMode,
        palette.variants.primary["action"],
        palette.variants.primary["action.dark"]
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
          palette.variants.primary.disabled,
          palette.variants.primary["disabled.dark"]
        ),
        border: `1px solid ${mode(
          colorMode,
          palette.variants.primary.border,
          palette.variants.primary["border.dark"]
        )}`,
        color: mode(
          colorMode,
          palette.colors.secondary.main,
          palette.colors.secondary["main.dark"]
        ),
        opacity: 1,
      },
    }),
    primary: ({ colorMode }) => ({
      backgroundColor: mode(colorMode, "red", "blue"),
    }),
  },
};
