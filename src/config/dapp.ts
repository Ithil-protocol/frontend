import { ChainId, Config, Goerli } from '@usedapp/core';

import { infuraUrl, alchemyUrl, pollingIntervalProvider } from '@/global/utils';

export const POLLING_INTERVAL = 10_000;

export const DAPP_CONFIG: Config = {
  readOnlyChainId: ChainId.Goerli,
  networks: [Goerli],
  readOnlyUrls: {
    [Goerli.chainId]: pollingIntervalProvider(
      alchemyUrl(Goerli.chainId),
      POLLING_INTERVAL
    ),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 2,
};
