/** @jsxImportSource @emotion/react */
import { ChakraBaseProvider, ColorModeScript } from '@chakra-ui/react'
import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Navigate, Route, Routes } from 'react-router-dom'
import 'shepherd.js/dist/css/shepherd.css'
import 'twin.macro'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import Navbar from 'src/components/navigation/Navbar'
import APP_ROUTES from 'src/config/routes'
import { useAnalytics } from 'src/hooks/useAnalytics'

import { anvilNetwork } from './config/chains'
import MaintenancePage from './pages/maintenance/Maintenance'
import { useTheme } from './state/application/hooks'
import { theme as chakraTheme } from './styles/chakra.theme'
import { ithilDarkTheme } from './styles/rainbowkit'

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

const queryClient = new QueryClient()

const App = () => {
  useAnalytics()
  const theme = useTheme()
  const isMaintenanceMode: boolean = process.env.REACT_APP_MAINTENANCE_MODE === 'true'

  return (
    <WagmiConfig client={wagmiClient}>
      <ColorModeScript initialColorMode={theme === 'dark' ? 'dark' : 'light'} />
      <RainbowKitProvider
        chains={chains}
        initialChain={anvilNetwork}
        theme={
          theme === 'dark'
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
            <SkeletonTheme
              baseColor={theme === 'dark' ? '#262e45' : '#e2e3e3'}
              highlightColor={theme === 'dark' ? '#48516d' : '#f5f5f5'}
            >
              <div tw="flex flex-col bg-primary min-h-screen desktop:flex-row" id="first-element">
                <div tw="grow flex flex-col">
                  {!isMaintenanceMode && <Navbar />}
                  <Routes>
                    {!isMaintenanceMode ? (
                      APP_ROUTES.map((route) => <Route key={route.path} path={route.path} element={route.component} />)
                    ) : (
                      <Route path="/" element={<MaintenancePage />} />
                    )}
                    <Route path="*" element={<Navigate to={isMaintenanceMode ? '/' : '/trade'} replace />} />
                  </Routes>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
              </div>
            </SkeletonTheme>
          </ChakraBaseProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
