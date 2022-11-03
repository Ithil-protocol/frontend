import { Goerli, Localhost } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { alchemyUrl } from '@/global/utils';

const supportedChains = [Goerli.chainId, Localhost.chainId];

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains,
});

const defaulUrls = {
  [Goerli.chainId]: alchemyUrl(Goerli.chainId),
};

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Goerli.chainId]: alchemyUrl(Goerli.chainId),
    [Localhost.chainId]:
      process.env.REACT_APP_LOCALHOST_RPC ?? 'http://localhost:8545',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChains,
});
