import { JsonRpcProvider } from '@ethersproject/providers';
import { DEFAULT_SUPPORTED_CHAINS, Mainnet } from '@usedapp/core';

export function infuraUrl(chainId: number) {
  const chainName =
    DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)
      ?.chainName || Mainnet.chainName;

  return `https://${chainName.toLowerCase()}.infura.io/v3/${
    process.env.REACT_APP_INFURA_ID
  }`;
}

export function pollingIntervalProvider(
  rpcUrl: string,
  pollingInterval: number
) {
  const rpcProvider = new JsonRpcProvider(rpcUrl);
  rpcProvider.pollingInterval = pollingInterval;

  return rpcProvider;
}
