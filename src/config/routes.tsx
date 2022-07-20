import React from 'react';

import { RouteType } from '@/global/types';

const StakePage = require('@/pages/stake');
const TradePage = require('@/pages/trade');
const DashboardPage = require('@/pages/dashboard');
const MarginTradingPage = require('@/pages/trade/margin-trading');
const LeveragedStakingPage = require('@/pages/trade/leveraged-staking');

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
