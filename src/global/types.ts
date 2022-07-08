import { ReactNode } from 'react';

export interface RouteType {
  path: string;
  component: ReactNode;
  title: string;
  isNavLinked: boolean;
}
