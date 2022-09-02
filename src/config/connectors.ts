import { Goerli, Mainnet, Localhost } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { infuraUrl } from '@/global/utils';

const supportedChains = [Mainnet.chainId, Goerli.chainId, Localhost.chainId];

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains,
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Mainnet.chainId]: infuraUrl(Mainnet.chainId),
    [Goerli.chainId]: infuraUrl(Goerli.chainId),
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChains,
});
