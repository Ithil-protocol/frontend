import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

import Sidebar from "@/containers/Sidebar";
import { theme } from "@/styles/theme/chakra";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="pt-0 mt-0">
        {false && <Sidebar />}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
