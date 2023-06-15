import { StyleConfig } from "@chakra-ui/react";

export const ithilSkeletonStyle: StyleConfig = {
  baseStyle: {
    _dark: {
      "--skeleton-start-color": "#e2e3e3",
      "--skeleton-end-color": "#f5f5f5",
    },
    _light: {
      "--skeleton-start-color": "#262e45",
      "--skeleton-end-color": "#48516d",
    },
  },
};
