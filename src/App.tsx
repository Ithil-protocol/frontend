/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { ShepherdTour } from 'react-shepherd';
import { SkeletonTheme } from 'react-loading-skeleton';

import { useTheme } from './state/application/hooks';
import MaintenancePage from './pages/maintenance/Maintenance';

import Navbar from 'src/components/navigation/Navbar';
import { injected } from 'src/config/connectors';
import APP_ROUTES from 'src/config/routes';
import { steps, options } from 'src/global/tutorial';
import { useAnalytics } from 'src/hooks/useAnalytics';
import 'shepherd.js/dist/css/shepherd.css';

const App = () => {
  useAnalytics();
  const { activate } = useEthers();
  const theme = useTheme();
  const isMaintenanceMode: boolean =
    process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShepherdTour steps={steps} tourOptions={options}>
      <SkeletonTheme
        baseColor={theme === 'dark' ? '#262e45' : '#e2e3e3'}
        highlightColor={theme === 'dark' ? '#48516d' : '#f5f5f5'}
      >
        <div
          css={[tw`flex flex-col bg-primary min-h-screen desktop:flex-row`]}
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
                  <Navigate to={isMaintenanceMode ? '/' : '/trade'} replace />
                }
              />
            </Routes>
          </div>
        </div>
      </SkeletonTheme>
    </ShepherdTour>
  );
};

export default App;
