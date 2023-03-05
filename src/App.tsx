/** @jsxImportSource @emotion/react */
import 'twin.macro'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'

import { useTheme } from './state/application/hooks'
import MaintenancePage from './pages/maintenance/Maintenance'

import Navbar from 'src/components/navigation/Navbar'
import APP_ROUTES from 'src/config/routes'
import { useAnalytics } from 'src/hooks/useAnalytics'
import 'shepherd.js/dist/css/shepherd.css'

import {
  lightTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli, localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ithilDarkTheme } from './styles/rainbowkit'
import { NextUIProvider, defaultTheme as uiLight } from '@nextui-org/react'
import { uiDark } from './styles/nextui.theme'

const { chains, provider } = configureChains(
  [goerli, localhost],
  [publicProvider()]
)
const { connectors } = getDefaultWallets({
  appName: 'Ithil',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const App = () => {
  useAnalytics()
  const theme = useTheme()
  const isMaintenanceMode: boolean =
    process.env.REACT_APP_MAINTENANCE_MODE === 'true'

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
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
        <NextUIProvider theme={theme === 'dark' ? uiDark : uiLight}>
          <SkeletonTheme
            baseColor={theme === 'dark' ? '#262e45' : '#e2e3e3'}
            highlightColor={theme === 'dark' ? '#48516d' : '#f5f5f5'}
          >
            <div
              tw="flex flex-col bg-primary min-h-screen desktop:flex-row"
              id="first-element"
            >
              <div tw="grow flex flex-col">
                {!isMaintenanceMode && <Navbar />}
                <Routes>
                  {!isMaintenanceMode ? (
                    APP_ROUTES.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.component}
                      />
                    ))
                  ) : (
                    <Route path="/" element={<MaintenancePage />} />
                  )}
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={isMaintenanceMode ? '/' : '/trade'}
                        replace
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </SkeletonTheme>
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
