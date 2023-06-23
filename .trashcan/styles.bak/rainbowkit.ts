import { type Theme, midnightTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash/merge";

export const rainbowkitDarkTheme: Theme = merge(midnightTheme(), {
  colors: {
    connectButtonBackground: "#20293A",
    connectButtonInnerBackground: "#151A29",
    modalBackground: "#20293A",
  },
  fonts: {
    body: "Raleway,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
  },
  radii: {
    connectButton: "6px",
  },
} as Theme);
