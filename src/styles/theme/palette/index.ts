const colors = {
  primary: {
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
  },

  secondary: {
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
  },
};

const variants = {
  primary: {
    action: "#077ce0",
    disabled: colors.primary["300"],
    success: "#15ac89",
    border: colors.secondary["200"],
    error: "#f35959",
    warning: "#e9cf4a",
    warningLight: "#f3e7a8",

    "action.dark": "#077ce0",
    "disabled.dark": colors.primary["100.dark"],
    "success.dark": "#15ac89",
    "error.dark": "#f35959",
    "warning.dark": "#e9cf4a",
    "warningLight.dark": "#f3e7a8",
    "border.dark": colors.secondary["200"],
  },
};

const safety = {
  green: "#47dcb0",
  red: "#ff7a8a",
  neutral: colors.secondary.main,

  "green.dark": "#47dcb0",
  "red.dark": "#ff7a8a",
  "neutral.dark": colors.secondary["main.dark"],
};

const font = {
  main: colors.secondary.main,
  100: colors.secondary["400"],
  200: colors.secondary["200"],
  button: colors.primary["100"],

  "main.dark": colors.secondary["100.dark"],
  "100.dark": "#a4b1be",
  get "200.dark"() {
    return this["100.dark"];
  },
  "button.dark": colors.secondary["main.dark"],
};

export const palette = {
  colors,
  font,
  safety,
  variants,
};
