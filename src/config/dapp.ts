import { Config, Goerli, Localhost, Mainnet } from '@usedapp/core';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { alchemyUrl, pollingIntervalProvider } from '@/global/utils';
import { TENDERLY_RPC_API } from '@/global/constants';

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
  readOnlyChainId: Mainnet.chainId,
  networks: [
    Goerli,
    {
      ...Localhost,
      multicallAddress: Mainnet.multicallAddress,
      multicall2Address: Mainnet.multicall2Address,
      rpcUrl: TENDERLY_RPC_API,
    },
  ],
  readOnlyUrls: {
    [Goerli.chainId]: pollingIntervalProvider(
      alchemyUrl(Goerli.chainId),
      POLLING_INTERVAL
    ),
    [Localhost.chainId]: new StaticJsonRpcProvider(TENDERLY_RPC_API, {
      name: 'Localhost',
      chainId: 1337,
    }),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 2,
  multicallAddresses: {
    [Goerli.chainId]: Goerli.multicall2Address ?? '',
    [Localhost.chainId]: Mainnet.multicall2Address ?? '',
  },
};
