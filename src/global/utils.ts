import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'bignumber.js';
import { DEFAULT_SUPPORTED_CHAINS, Mainnet } from '@usedapp/core';

import { TOKEN_LIST } from './constants';

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
  value: string | number | BigNumber,
  decimals = 18,
  localeFormat = true,
  fractionDigits = 2
) {
  const number = Number(
    (typeof value === 'object'
      ? value
      : new BigNumber(typeof value === 'number' ? value.toString() : value)
    )
      .dividedBy(new BigNumber(10).pow(decimals))
      .toString()
  );
  if (localeFormat)
    return number.toLocaleString('en-US', {
      maximumFractionDigits: fractionDigits,
    });
  return number.toString();
}

export function parseAmount(value: number | string, decimals = 18) {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
}

export function getTokenByAddress(tokenAddress: string) {
  return TOKEN_LIST.find((token) => token.address === tokenAddress);
}
