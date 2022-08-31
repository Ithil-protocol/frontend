/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { initialize, pageview } from 'react-ga';
import { useEthers } from '@usedapp/core';
import { ShepherdTour } from 'react-shepherd';

import Navbar from '@/components/navigation/Navbar';
import { injected } from '@/config/connectors';
import APP_ROUTES from '@/config/routes';
import { steps, options } from '@/global/tutorial';

import 'shepherd.js/dist/css/shepherd.css';

initialize('G-YG89SWDD9M');

const App = () => {
  useEffect(() => {
    pageview(window.location.pathname + window.location.search);
  }, []);

  const { activate } = useEthers();

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
      <div
        css={[tw`flex flex-col bg-primary min-h-screen desktop:flex-row`]}
        id="first-element"
      >
        <div tw="flex-grow flex flex-col">
          <Navbar />
          <Routes>
            {APP_ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
            <Route path="*" element={<Navigate to="/trade" replace />} />
          </Routes>
        </div>
      </div>
    </ShepherdTour>
  );
};

export default App;
