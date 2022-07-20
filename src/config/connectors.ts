import { Goerli, Mainnet, Rinkeby } from '@devneser/usedapp-core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { infuraUrl } from '@/global/utils';

export const injected = new InjectedConnector({
  supportedChainIds: [Mainnet.chainId, Goerli.chainId, Rinkeby.chainId],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Mainnet.chainId]: infuraUrl(Mainnet.chainId),
    [Goerli.chainId]: infuraUrl(Goerli.chainId),
    [Rinkeby.chainId]: infuraUrl(Rinkeby.chainId),
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: [Mainnet.chainId, Goerli.chainId, Rinkeby.chainId],
});
