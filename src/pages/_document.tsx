import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

import { theme } from "@/styles/theme/chakra";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="pt-0 mt-0">
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
