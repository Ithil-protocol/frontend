/* eslint-disable react-hooks/exhaustive-deps */
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { toggleTheme, updateWalletConnector } from './index';
import { ThemeType, WalletConnectorType } from './types';

import { AppState } from '@/state/store';
import { ReactComponent as MetaMaskIcon } from '@/assets/images/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/walletconnect.svg';

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// === theme ===

export const useTheme = () =>
  useAppSelector((state) => state.application.theme) as ThemeType;

export const useToggleTheme = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    dispatch(toggleTheme());
  };
};

// === walletConnector  ===

export const useWalletConnector = () =>
  useAppSelector(
    (state) => state.application.walletConnector
  ) as WalletConnectorType;

export const useUpdateWalletConnector = () => {
  const dispatch = useDispatch();
  return (connector: WalletConnectorType) =>
    dispatch(updateWalletConnector(connector));
};

export const useWalletConnectorIcon = () => {
  const connector = useWalletConnector();

  if (connector === 'none') return null;
  return connector === 'injected' ? MetaMaskIcon : WalletConnectIcon;
};
