import { Goerli, Hardhat } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { IS_HARDHAT_SET } from './dapp';

import { alchemyUrl } from '@/global/utils';

const supportedChains = [Goerli.chainId].concat(
  IS_HARDHAT_SET ? [Hardhat.chainId] : []
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
    ...(IS_HARDHAT_SET
      ? {
          [Hardhat.chainId]:
            process.env.REACT_APP_HARDHAT_RPC ?? 'http://localhost:8545',
        }
      : {}),
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChains,
});
