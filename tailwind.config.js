const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};
const generateFont = (variable) => {
  return [`var(--fontsize-${variable})`, `var(--lineheight-${variable})`];
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  important: true,
  theme: {
    fontFamily: {
      sans: [
        'Raleway',
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      ],
    },
    fontSize: {
      'mobile-medium': generateFont('caption-medium'),
      'caption-medium': generateFont('caption-medium'),
      'body2-regular': generateFont('body2-regular'),
      'body2-bold': generateFont('body2-bold'),
      'body1-regular': generateFont('body1-regular'),
      'button-medium': generateFont('button-medium'),
      'body1-bold': generateFont('body1-bold'),
      'input-text': generateFont('input-text'),
      heading2: generateFont('heading2'),
      heading1: generateFont('heading1'),
    },
    colors: {
      primary: {
        DEFAULT: generateColorClass('primary'),
        100: generateColorClass('primary-100'),
        200: generateColorClass('primary-200'),
        300: generateColorClass('primary-300'),
        400: generateColorClass('primary-400'),
      },
      secondary: {
        DEFAULT: generateColorClass('secondary'),
        100: generateColorClass('secondary-100'),
        200: generateColorClass('secondary-200'),
        300: generateColorClass('secondary-300'),
        400: generateColorClass('secondary-400'),
      },
      font: {
        DEFAULT: generateColorClass('font'),
        100: generateColorClass('font-100'),
        200: generateColorClass('font-200'),
      },
      error: {
        DEFAULT: generateColorClass('primary-error'),
      },
      success: {
        DEFAULT: generateColorClass('primary-success'),
      },
      action: {
        DEFAULT: generateColorClass('primary-action'),
      },
      warning: {
        DEFAULT: generateColorClass('primary-warning'),
      },
      'warning-light': {
        DEFAULT: generateColorClass('primary-warning-light'),
      },
      hover: {
        light: generateColorClass('button-hover-light'),
        dark: generateColorClass('button-hover-dark'),
        action: generateColorClass('button-hover-action'),
      },
      disabled: {
        light: generateColorClass('button-disabled-light'),
        dark: generateColorClass('button-disabled-dark'),
        action: generateColorClass('button-disabled-action'),
      },
      white: {
        DEFAULT: '#FFFFFF',
        100: '#F2F5F6',
        200: '#E7EAEB',
        300: '#E2E5E5',
        400: '#4E5F71',
      },
      black: {
        DEFAULT: '#070B0F',
        100: '#151A29',
        200: '#20293A',
        300: '#364153',
        400: '#4E5F71',
      },
    },
    extend: {
      maxWidth: {
        1920: '1920px',
      },
      borderWidth: {
        1: '1px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      screens: {
        tablet: '480px',
        desktop: '1024px',
      },
    },
  },
  plugins: [],
};
