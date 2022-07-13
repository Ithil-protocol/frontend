/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

import Navbar from '@/components/navigation/Navbar';
import APP_ROUTES from '@/config/routes';

const App = () => {
  const location = useLocation();
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  return (
    <div css={[tw`flex flex-col bg-primary min-h-screen desktop:flex-row`]}>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          tw="flex-grow flex flex-col"
          style={{
            ...props,
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          key={key}
        >
          <Navbar />
          <Routes location={item}>
            {APP_ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Routes>
        </animated.div>
      ))}
    </div>
  );
};

export default App;
