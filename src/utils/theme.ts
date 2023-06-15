export const mode = (
  colorMode: "light" | "dark",
  lightColor: string,
  darkColor: string
) => (colorMode === "light" ? lightColor : darkColor);
