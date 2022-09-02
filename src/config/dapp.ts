import { ChainId, Config, Goerli, Mainnet, Localhost } from '@usedapp/core';

import { infuraUrl, pollingIntervalProvider } from '@/global/utils';

export const POLLING_INTERVAL = 10_000;

export const DAPP_CONFIG: Config = {
  readOnlyChainId: ChainId.Mainnet,
  networks: [Mainnet, Goerli, Localhost],
  readOnlyUrls: {
    [Mainnet.chainId]: pollingIntervalProvider(
      infuraUrl(Mainnet.chainId),
      POLLING_INTERVAL
    ),
    [Goerli.chainId]: pollingIntervalProvider(
      infuraUrl(Goerli.chainId),
      POLLING_INTERVAL
    ),
    [Localhost.chainId]: pollingIntervalProvider(
      'htto://localhost:8545',
      POLLING_INTERVAL
    ),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 2,
};
