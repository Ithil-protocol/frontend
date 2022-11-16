import React from 'react';

import { RouteType } from 'src/global/types';
import StakePage from 'src/pages/stake/Stake';
import TradePage from 'src/pages/trade/Trade';
import DashboardPage from 'src/pages/dashboard/Dashboard';
import MarginTradingPage from 'src/pages/trade/MarginTrading';
import YearnStrategyPage from 'src/pages/trade/YearnStrategy';
import PositionDetails from 'src/pages/dashboard/PositionDetails';
import FaucetsPage from 'src/pages/faucets/Faucets';
import VaultDetails from 'src/pages/stake/VaultDetails';
import BalancerAuraStrategyPage from 'src/pages/trade/BalancerAuraStrategy';

const APP_ROUTES: RouteType[] = [
  {
    path: '/trade',
    component: <TradePage />,
    title: 'Trade',
    isNavLinked: true,
  },
  {
    path: '/trade/margin-trading',
    component: <MarginTradingPage />,
    title: 'Margin Trading',
    isNavLinked: false,
  },
  {
    path: '/trade/yearn-strategy',
    component: <YearnStrategyPage />,
    title: 'Yearn Strategy',
    isNavLinked: false,
  },
  {
    path: '/trade/balancer-aura-strategy',
    component: <BalancerAuraStrategyPage />,
    title: 'Balancer+Aura Strategy',
    isNavLinked: false,
  },
  {
    path: '/stake',
    component: <StakePage />,
    title: 'Stake',
    isNavLinked: true,
  },
  {
    path: '/stake/details',
    component: <VaultDetails />,
    title: 'Vault Details',
    isNavLinked: false,
  },
  {
    path: '/dashboard',
    component: <DashboardPage />,
    title: 'Dashboard',
    isNavLinked: true,
  },
  {
    path: '/dashboard/position',
    component: <PositionDetails />,
    title: 'Position Details',
    isNavLinked: false,
  },
  {
    path: '/faucets',
    component: <FaucetsPage />,
    title: 'Faucets',
    isNavLinked: true,
  },
];

export default APP_ROUTES;
