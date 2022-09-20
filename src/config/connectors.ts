import { Goerli } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { infuraUrl, alchemyUrl } from '@/global/utils';

const supportedChains = [Goerli.chainId];

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains,
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Goerli.chainId]: alchemyUrl(Goerli.chainId),
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChains,
});
