import { type Theme, lightTheme, midnightTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash/merge";

import { palette } from "./palette";

export const rainbowkitDarkTheme: Theme = merge(midnightTheme(), {
  colors: {
    connectButtonBackground: "#20293A",
    connectButtonInnerBackground: "#151A29",
    modalBackground: "#20293A",
    modalText: palette.colors.primary["main"],
  },
  fonts: {
    body: "Raleway,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
  },
  radii: {
    connectButton: "4px",
  },
} as Theme);

export const rainbowkitLightTheme: Theme = merge(lightTheme(), {
  colors: {
    connectButtonInnerBackground: "#151A29",
    modalText: palette.colors.primary["main.dark"],
  },
  fonts: {
    body: "Raleway,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
  },
  radii: {
    connectButton: "4px",
  },
});
