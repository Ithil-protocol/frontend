import { ChakraBaseProvider, useColorMode } from '@chakra-ui/react'
import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient, removeOldestQuery } from '@tanstack/react-query-persist-client'
import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import Navbar from '@/components/navbar'
import { anvilNetwork } from '@/config/chains'
import { theme as chakraTheme } from '@/styles/chakra.theme'
import '@/styles/globals.css'
import { ithilDarkTheme } from '@/styles/rainbowkit'

const { chains, provider } = configureChains([anvilNetwork, localhost], [publicProvider()])
const { connectors } = getDefaultWallets({
  appName: 'Ithil',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

// persist cache only in client mode, that's good enough for now
const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  retry: removeOldestQuery,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})

export default function App({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode()
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        initialChain={anvilNetwork}
        theme={
          colorMode === 'dark'
            ? ithilDarkTheme
            : lightTheme({
                borderRadius: 'small',
                fontStack: 'system',
              })
        }
        showRecentTransactions={true}
      >
        <QueryClientProvider client={queryClient}>
          <ChakraBaseProvider theme={chakraTheme}>
            <div>
              <Navbar />
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          </ChakraBaseProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
