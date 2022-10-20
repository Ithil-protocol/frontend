import { Goerli, Localhost } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { IS_LOCALHOST_SET } from './dapp';

import { alchemyUrl } from '@/global/utils';

const supportedChains = [Goerli.chainId].concat(
  IS_LOCALHOST_SET ? [Localhost.chainId] : []
);

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains,
});

const defaulUrls = {
  [Goerli.chainId]: alchemyUrl(Goerli.chainId),
};

export const walletconnect = new WalletConnectConnector({
  rpc: {
    ...defaulUrls,
    ...(IS_LOCALHOST_SET
      ? {
          [Localhost.chainId]:
            process.env.REACT_APP_LOCALHOST_RPC ?? 'http://localhost:8545',
        }
      : {}),
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChains,
});
