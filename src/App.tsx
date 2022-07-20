/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from '@/components/navigation/Navbar';
import APP_ROUTES from '@/config/routes';

const App = () => {
  return (
    <div css={[tw`flex flex-col bg-primary min-h-screen desktop:flex-row`]}>
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
  );
};

export default App;
