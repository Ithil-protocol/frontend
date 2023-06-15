module.exports = {
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  "**/*.(ts|tsx|js|json)": (filenames) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  "**/*.(md)": (filenames) => `npx prettier --write ${filenames.join(" ")}`,
};
