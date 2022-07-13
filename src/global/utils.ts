import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
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

export function formatAmount(
  value: BigNumber,
  decimals = 18,
  fractionDigits = 2
) {
  return Number(formatUnits(value || '0', decimals)).toLocaleString('en-US', {
    maximumFractionDigits: fractionDigits,
  });
}
