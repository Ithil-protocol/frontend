import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  button: {
    fontWeight: "medium",
    bg: mode(colorMode, "primary.100", "primary.100.dark"),
    color: mode(colorMode, "primary.100", "primary.100.dark"),
    _hover: {
      bg: mode(colorMode, "primary.100", "primary.100.dark"),
      color: mode(colorMode, "primary.100.dark", "primary.100"),
    },
  },
  list: {
    py: "4",
    borderRadius: "xl",
    border: "none",
    bg: mode(colorMode, "primary.100", "primary.100.dark"),
  },
  item: {
    color: mode(colorMode, "primary.100.dark", "primary.100"),
    bg: mode(colorMode, "primary.100", "primary.100.dark"),
    _hover: {
      bg: mode(colorMode, "primary.100", "primary.100.dark"),
    },
    _focus: {
      bg: mode(colorMode, "primary.100", "primary.100.dark"),
    },
  },
  groupTitle: {
    textTransform: "uppercase",
    color: mode(colorMode, "primary.100.dark", "primary.100"),
    textAlign: "center",
    letterSpacing: "wider",
    opacity: "0.7",
  },
  command: {
    opacity: "0.8",
    fontFamily: "mono",
    fontSize: "sm",
    letterSpacing: "tighter",
    pl: "4",
  },
  divider: {
    my: "4",
    borderColor: mode(colorMode, "primary.100", "primary.100.dark"),
    borderBottom: "2px dotted",
  },
}));

export const menuStyle = defineMultiStyleConfig({ baseStyle });
