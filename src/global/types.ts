import { ReactNode } from 'react';

export interface RouteType {
  path: string;
  component: ReactNode;
  title: string;
  isNavLinked: boolean;
}

export interface IBaseProps {
  className?: string | undefined;
}

export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logoURI?: string | undefined;
}

export type IntervalType = '1d' | '1m' | '12m' | '60m';

export type PositionType = 'long' | 'short';

export type Priority = 'buy' | 'sell';
