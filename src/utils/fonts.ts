import { Poppins, Raleway } from "next/font/google";

export const body = Raleway({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  display: "block",
});
export const heading = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  display: "block",
});
