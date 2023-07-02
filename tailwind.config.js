/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

const generateColorClass = (variable) => `var(--${variable})`;
const generateFont = (variable) => [
  `var(--fontsize-${variable})`,
  `var(--lineheight-${variable})`,
];

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", ...fontFamily.sans],
        body: ["var(--font-body)", "sans"],
        heading: ["var(--font-heading)"],
      },
      fontSize: {
        "mobile-medium": generateFont("caption-medium"),
        "caption-medium": generateFont("caption-medium"),
        "body2-regular": generateFont("body2-regular"),
        "body2-bold": generateFont("body2-bold"),
        "body1-regular": generateFont("body1-regular"),
        "button-medium": generateFont("button-medium"),
        "body1-bold": generateFont("body1-bold"),
        "input-text": generateFont("input-text"),
        heading2: generateFont("heading2"),
        heading1: generateFont("heading1"),
      },
      colors: {
        primary: {
          DEFAULT: generateColorClass("primary"),
          100: generateColorClass("primary-100"),
          200: generateColorClass("primary-200"),
          300: generateColorClass("primary-300"),
          400: generateColorClass("primary-400"),
          500: generateColorClass("primary-500"),
          600: generateColorClass("primary-600"),
          700: generateColorClass("primary-700"),
          800: generateColorClass("primary-800"),
          contrast: generateColorClass("primary-contrast"),
        },
        secondary: {
          DEFAULT: generateColorClass("secondary"),
          100: generateColorClass("secondary-100"),
          200: generateColorClass("secondary-200"),
          300: generateColorClass("secondary-300"),
          400: generateColorClass("secondary-400"),
          500: generateColorClass("secondary-500"),
        },
        font: {
          DEFAULT: generateColorClass("font"),
          100: generateColorClass("font-100"),
          200: generateColorClass("font-200"),
        },
        error: {
          DEFAULT: generateColorClass("primary-error"),
        },
        success: {
          DEFAULT: generateColorClass("primary-success"),
        },
        action: {
          DEFAULT: generateColorClass("primary-action"),
        },
        warning: {
          DEFAULT: generateColorClass("primary-warning"),
        },
        "warning-light": {
          DEFAULT: generateColorClass("primary-warning-light"),
        },
        hover: {
          light: generateColorClass("button-hover-light"),
          dark: generateColorClass("button-hover-dark"),
          action: generateColorClass("button-hover-action"),
        },
        disabled: {
          light: generateColorClass("button-disabled-light"),
          dark: generateColorClass("button-disabled-dark"),
          action: generateColorClass("button-disabled-action"),
        },
        white: {
          DEFAULT: "#FFFFFF",
          100: "#F2F5F6",
          200: "#E7EAEB",
          300: "#E2E5E5",
          400: "#4E5F71",
        },
        black: {
          DEFAULT: "#070B0F",
          100: "#151A29",
          200: "#20293A",
          300: "#364153",
          400: "#4E5F71",
        },
      },
    },
  },
  plugins: [],
};
