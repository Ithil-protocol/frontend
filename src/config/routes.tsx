import React from 'react';

import { RouteType } from '@/global/types';
import StakePage from '@/pages/stake/index';
import TradePage from '@/pages/trade/index';
import DashboardPage from '@/pages/dashboard/index';
import MarginTradingPage from '@/pages/trade/margin-trading/index';
import LeveragedStakingPage from '@/pages/trade/leveraged-staking/index';

const APP_ROUTES: RouteType[] = [
  {
    path: '/trade',
    component: <TradePage />,
    title: 'Trade',
    isNavLinked: true,
  },
  {
    path: '/stake',
    component: <StakePage />,
    title: 'Stake',
    isNavLinked: true,
  },
  {
    path: '/dashboard',
    component: <DashboardPage />,
    title: 'Dashboard',
    isNavLinked: true,
  },
  {
    path: '/trade/margin-trading',
    component: <MarginTradingPage />,
    title: 'Margin Trading',
    isNavLinked: false,
  },
  {
    path: '/trade/leveraged-staking',
    component: <LeveragedStakingPage />,
    title: 'Leveraged Staking',
    isNavLinked: false,
  },
];

export default APP_ROUTES;
