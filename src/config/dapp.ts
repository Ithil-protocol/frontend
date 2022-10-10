import { ChainId, Config, Goerli, Hardhat } from '@usedapp/core';

import { alchemyUrl, pollingIntervalProvider } from '@/global/utils';

export const POLLING_INTERVAL = 10_000;

export const IS_HARDHAT_SET =
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_HARDHAT_ENV === 'true';

const defaulUrls = {
  [Goerli.chainId]: pollingIntervalProvider(
    alchemyUrl(Goerli.chainId),
    POLLING_INTERVAL
  ),
};

export const DAPP_CONFIG: Config = {
  readOnlyChainId: ChainId.Goerli,
  networks: [Goerli].concat(IS_HARDHAT_SET ? [Hardhat] : []),
  readOnlyUrls: {
    ...defaulUrls,
    ...(IS_HARDHAT_SET
      ? {
          [Hardhat.chainId]:
            process.env.REACT_APP_HARDHAT_RPC ?? 'http://localhost:8545',
        }
      : {}),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 2,
};
