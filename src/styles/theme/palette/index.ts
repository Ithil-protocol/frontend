const primary = {
  main: "#ffffff",
  100: "#f2f5f6",
  200: "#e7eaeb",
  300: "#e2e5e5",
  400: "#ced1d1",
  get contrast() {
    return this.main;
  },

  "main.dark": "#070b0f",
  "100.dark": "#151a29",
  "200.dark": "#20293a",
  "300.dark": "#364153",
  "400.dark": "#4e5f71",
  "500.dark": "#3d547b",
  "600.dark": "#1c2236",
  "700.dark": "#9badcc",
  "800.dark": "#6b7696",
  get "contrast.dark"() {
    return this["100.dark"];
  },
};

const secondary = {
  main: " #070b0f",
  100: "#151a29",
  200: "#a4b1be",
  300: "#20293a",
  400: "#4e5f71",

  "main.dark": "#ffffff",
  "100.dark": "#f2f5f6",
  "200.dark": "#e7eaeb",
  "300.dark": "#e2e5e5",
  "400.dark": "#ced1d1",
  "500.dark": "#505668",
};

const variant = {
  primary: {
    action: "#077ce0",
    disabled: primary["300"],
    success: "#15ac89",
    border: secondary["200"],
    error: "#f35959",
    warning: "#e9cf4a",
    warningLight: "#f3e7a8",

    "action.dark": "#077ce0",
    "disabled.dark": primary["100.dark"],
    "success.dark": "#15ac89",
    "error.dark": "#f35959",
    "warning.dark": "#e9cf4a",
    "warningLight.dark": "#f3e7a8",
    // "border.dark": secondary["200.dark"],
  },
};

const safety = {
  green: "#47dcb0",
  red: "#ff7a8a",
  neutral: secondary.main,

  "neutral.dark": secondary["main.dark"],
};

const font = {
  main: secondary.main,
  100: secondary["400"],
  200: secondary["200"],
  button: primary["100"],

  "main.dark": secondary["100.dark"],
  "100.dark": "#a4b1be",
  get "200.dark"() {
    return this["100.dark"];
  },
  "button.dark": secondary["main.dark"],
};

export const palette = {
  font,
  primary,
  safety,
  secondary,
  variant,
};
