import React from 'react';

import { RouteType } from '@/global/types';
import PositionPage from '@/pages/Position';
import StakePage from '@/pages/Stake';

const APP_ROUTES: RouteType[] = [
  {
    path: '/position',
    component: <PositionPage />,
    title: 'Position',
    isNavLinked: true,
  },
  {
    path: '/stake',
    component: <StakePage />,
    title: 'Stake',
    isNavLinked: true,
  },
];

export default APP_ROUTES;
