import "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { type FC, type PropsWithChildren } from "react";
import { WagmiConfig } from "wagmi";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import Head from "@/components/Head";
import PageWrapper from "@/components/page-wrapper";
import { testNetwork } from "@/config/chains";
import NotificationDialogProvider from "@/contexts/NotificationDialog";
import PositionModalProvider from "@/contexts/PositionModal";
import TokenModalProvider from "@/contexts/TokenModal";
import { useColorMode } from "@/hooks/useColorMode";
import { queryClient } from "@/lib/react-query";
import { chains, wagmiClient } from "@/lib/wagmi";
import { Chakra } from "@/styles/ChakraCustomProvider";
import "@/styles/globals.css";
import {
  rainbowkitDarkTheme,
  rainbowkitLightTheme,
} from "@/styles/theme/rainbowkit";

// this wrapper is necessary, as it must be nested inside the ChakraProvider,
// in that point can correctly read the colorMode
const RainbowWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <RainbowKitProvider
      chains={chains}
      initialChain={testNetwork}
      theme={colorMode === "dark" ? rainbowkitDarkTheme : rainbowkitLightTheme}
      showRecentTransactions={true}
    >
      {children}
    </RainbowKitProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <Head />
      <WagmiConfig config={wagmiClient}>
        <QueryClientProvider client={queryClient}>
          <Chakra>
            <RainbowWrapper>
              <PageWrapper>
                <NotificationDialogProvider>
                  <TokenModalProvider>
                    <PositionModalProvider>
                      <Component {...pageProps} />
                    </PositionModalProvider>
                  </TokenModalProvider>
                </NotificationDialogProvider>
                <ReactQueryDevtools initialIsOpen={false} />
              </PageWrapper>
            </RainbowWrapper>
          </Chakra>
        </QueryClientProvider>
      </WagmiConfig>
    </>
  );
}

export { getServerSideProps } from "@/styles/ChakraCustomProvider";
