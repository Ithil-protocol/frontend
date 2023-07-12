module.exports = {
  env: {
    es2021: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@cspell/recommended",
    "next/core-web-vitals",
    "plugin:json/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  globals: {
    JSX: true,
    React: true,
  },
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "@cspell", "unused-imports"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@cspell/spellchecker": [
      "warn",
      {
        autoFix: false,
        checkComments: false,
        ignoreImportProperties: false,
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "arrow-parens": "warn",
    // "linebreak-style": ["error", "unix"],
    "no-delete-var": "warn",
    "no-unused-vars": "off",
    "no-use-before-define": [
      "error",
      {
        allowNamedExports: false,
        classes: true,
        functions: false,
        variables: false,
      },
    ],
    "no-var": "warn",
    "object-shorthand": ["error", "always"],
    quotes: ["warn", "double"],
    semi: "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        vars: "all",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
