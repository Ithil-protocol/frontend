import { useColorMode } from "@chakra-ui/react";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { removeOldestQuery } from "@tanstack/react-query-persist-client";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageWrapper from "@/components/page-wrapper";
import { addTestNetworks, firstNetwork, testNetwork } from "@/config/chains";
import NotificationDialogProvider from "@/providers/notificationDialog";
import { Chakra } from "@/styles/ChakraCustomProvider";
import "@/styles/globals.css";
import {
  rainbowkitDarkTheme,
  rainbowkitLightTheme,
} from "@/styles/theme/rainbowkit";
import { pageHeading } from "@/utils";

const network = firstNetwork();
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [network], // until Ithil is not a multi-chain app, we can use only one network
  [
    jsonRpcProvider({
      rpc: (_chain) => ({ http: network.rpcUrls.default.http[0] }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Ithil Core",
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
    },
  },
});

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  queryClient,
});

// persist cache only in client mode, that's good enough for now
const _localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  retry: removeOldestQuery,
});

// persistQueryClient({
//   queryClient,
//   persister: localStoragePersister,
// });

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
  const [heading, setHeading] = useState<string>("");
  // effect only for private and testnet mode
  useEffect(() => {
    void addTestNetworks();
  }, []);
  const router = useRouter();
  useEffect(() => {
    setHeading("");
    pageHeading.forEach((item) => {
      if (router.pathname.split("/")[1] === item.pathName) {
        return setHeading(item.heading);
      }
    });
  }, [router]);

  return (
    <>
      <GoogleAnalytics />
      <WagmiConfig config={wagmiClient}>
        <QueryClientProvider client={queryClient}>
          <Chakra>
            <RainbowWrapper>
              <PageWrapper heading={heading} textAlign="left">
                <NotificationDialogProvider>
                  <Component {...pageProps} />
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
