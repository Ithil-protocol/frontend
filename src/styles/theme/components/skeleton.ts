import {
  cssVar,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/styled-system";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const baseStyle = defineStyle({
  _light: {
    [$startColor.variable]: "#e2e3e3",
    [$endColor.variable]: "#f5f5f5",
  },

  _dark: {
    [$startColor.variable]: "#262e45",
    [$endColor.variable]: "#48516d",
  },
  background: $startColor.reference,
  borderColor: $endColor.reference,
  opacity: 0.7,
  borderRadius: "sm",
});

export const ithilSkeletonStyle = defineStyleConfig({
  baseStyle,
});
