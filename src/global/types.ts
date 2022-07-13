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
