import { ChakraBaseProvider, useColorMode } from '@chakra-ui/react'
import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient, removeOldestQuery } from '@tanstack/react-query-persist-client'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import Navbar from '@/components/navbar'
import { addTestNetworks, firstNetwork } from '@/config/chains'
import { theme as chakraTheme } from '@/styles/chakra.theme'
import '@/styles/globals.css'
import { ithilDarkTheme } from '@/styles/rainbowkit'

const network = firstNetwork()
const { chains, provider } = configureChains(
  [network],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }) })],
)
const { connectors } = getDefaultWallets({
  appName: 'Ithil Core',
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

  // effect only for private and testnet mode
  useEffect(() => addTestNetworks(), [])

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        initialChain={network}
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
