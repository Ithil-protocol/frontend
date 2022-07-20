import React from 'react';

import { RouteType } from '@/global/types';
import StakePage from '@/pages/stake/Stake';
import TradePage from '@/pages/trade/Trade';
import DashboardPage from '@/pages/dashboard/Dashboard';
import MarginTradingPage from '@/pages/trade/MarginTrading';
import LeveragedStakingPage from '@/pages/trade/LeveragedStaking';

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
