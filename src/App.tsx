/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { initialize, pageview } from 'react-ga';
import { useEthers } from '@usedapp/core';
import { ShepherdTour } from 'react-shepherd';
import { SkeletonTheme } from 'react-loading-skeleton';

import { useTheme } from './state/application/hooks';
import MaintenancePage from './pages/maintenance/Maintenance';

import Navbar from '@/components/navigation/Navbar';
import { injected } from '@/config/connectors';
import APP_ROUTES from '@/config/routes';
import { steps, options } from '@/global/tutorial';

import 'shepherd.js/dist/css/shepherd.css';

initialize('G-YG89SWDD9M');

const App = () => {
  const { activate } = useEthers();
  const theme = useTheme();
  const location = useLocation();
  const isMaintenanceMode: boolean =
    process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  // Fired on every route change
  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

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
          <div tw="flex-grow flex flex-col">
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
