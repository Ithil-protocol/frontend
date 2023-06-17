import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  persistQueryClient,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import type { AppProps } from "next/app";
import { type FC, type PropsWithChildren, useEffect } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { localhost } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import Navbar from "@/components/navbar";
import { addTestNetworks, firstNetwork } from "@/config/chains";
import "@/styles/globals.css";
import { theme as chakraTheme } from "@/styles/theme/chakra";
import { ithilDarkTheme } from "@/styles/theme/rainbowkit";

// const network =
firstNetwork();
const { chains, provider } = configureChains(
  [localhost], // until Ithil is not a multi-chain app, we can use only one network
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Ithil Core",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// persist cache only in client mode, that's good enough for now
const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  retry: removeOldestQuery,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

// this wrapper is necessary, as it must be nested inside the ChakraProvider,
// in that point can correctly read the colorMode
const RainbowWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <RainbowKitProvider
      chains={chains}
      initialChain={localhost}
      theme={
        colorMode === "dark"
          ? ithilDarkTheme
          : lightTheme({
              borderRadius: "small",
              fontStack: "system",
            })
      }
      showRecentTransactions={true}
    >
      {children}
    </RainbowKitProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  // effect only for private and testnet mode
  useEffect(() => {
    void addTestNetworks();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={chakraTheme}>
          <RainbowWrapper>
            <div>
              <Navbar />
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          </RainbowWrapper>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
