import { Config, Goerli, Localhost, Mainnet } from '@usedapp/core';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { alchemyUrl, pollingIntervalProvider } from '@/global/utils';

export const POLLING_INTERVAL = 10_000;

export const IS_LOCALHOST_SET =
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_LOCALHOST_ENV === 'true';

const defaulUrls = {
  [Goerli.chainId]: pollingIntervalProvider(
    alchemyUrl(Goerli.chainId),
    POLLING_INTERVAL
  ),
};

export const DAPP_CONFIG: Config = {
  readOnlyChainId: Mainnet.chainId,
  networks: [Goerli].concat(
    IS_LOCALHOST_SET
      ? [
          {
            ...Localhost,
            multicallAddress: Mainnet.multicallAddress,
            multicall2Address: Mainnet.multicall2Address,
            rpcUrl:
              process.env.REACT_APP_LOCALHOST_RPC ?? 'http://localhost:8545',
          },
        ]
      : []
  ),
  readOnlyUrls: {
    ...defaulUrls,
    ...(IS_LOCALHOST_SET
      ? {
          [Localhost.chainId]: new StaticJsonRpcProvider(
            process.env.REACT_APP_LOCALHOST_RPC ?? 'http://localhost:8545',
            {
              name: 'Localhost',
              chainId: 1337,
            }
          ),
        }
      : {}),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 1,
  multicallAddresses: {
    [Goerli.chainId]: Goerli.multicallAddress,
    [Localhost.chainId]: Mainnet.multicallAddress,
  },
};
