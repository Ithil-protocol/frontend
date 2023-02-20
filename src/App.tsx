/** @jsxImportSource @emotion/react */
import 'twin.macro'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ShepherdTour } from 'react-shepherd'
import { SkeletonTheme } from 'react-loading-skeleton'

import { useTheme } from './state/application/hooks'
import MaintenancePage from './pages/maintenance/Maintenance'

import Navbar from 'src/components/navigation/Navbar'
import APP_ROUTES from 'src/config/routes'
import { steps, options } from 'src/global/tutorial'
import { useAnalytics } from 'src/hooks/useAnalytics'
import 'shepherd.js/dist/css/shepherd.css'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli, localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, provider } = configureChains(
  [localhost, goerli],
  [publicProvider()]
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
})

const App = () => {
  useAnalytics()
  const theme = useTheme()
  const isMaintenanceMode: boolean =
    process.env.REACT_APP_MAINTENANCE_MODE === 'true'

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ShepherdTour steps={steps} tourOptions={options}>
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
        </ShepherdTour>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
