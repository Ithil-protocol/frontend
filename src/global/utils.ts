import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'bignumber.js';
import { DEFAULT_SUPPORTED_CHAINS, Mainnet } from '@usedapp/core';

import { STRATEGIES, TOKEN_LIST } from './constants';
import { TokenDetails } from './types';

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
  fractionDigits = 4
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
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    });
  return number.toString();
}

export function parseAmount(value: number | string, decimals = 18) {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
}

export function formatAmountToNumber(value: BigNumber | string, decimals = 18) {
  return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
}

export function getTokenByAddress(tokenAddress: string) {
  return TOKEN_LIST.find((token) => token.address === tokenAddress);
}

export function getStrategyByType(type: string) {
  const filtered = Object.keys(STRATEGIES).filter(
    (id) => STRATEGIES[id].type === type
  );
  if (!filtered.length) return undefined;
  return STRATEGIES[filtered[0]];
}

export async function importToken(token: TokenDetails) {
  await (window as any).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: token.logoURI,
      },
    },
  });
}

export function baseInterestRate(
  baseFee: BigNumber,
  netLoans: BigNumber,
  insuranceReserveBalance: BigNumber,
  balance: BigNumber,
  collateral: BigNumber,
  maxSpent: BigNumber,
  riskFactor: BigNumber
) {
  console.log('baseFee', baseFee.toString());
  console.log('netLoans', netLoans.toString());
  console.log('insuranceReserveBalance', insuranceReserveBalance.toString());
  console.log('balance', balance.toString());
  console.log('collateral', collateral.toString());
  console.log('maxSpent', maxSpent.toString());
  console.log('riskFactor', riskFactor.toString());

  return baseFee.plus(
    netLoans
      .plus(
        BigNumber.max(netLoans.minus(insuranceReserveBalance), 0)
          .plus(maxSpent)
          .minus(collateral)
      )
      .multipliedBy(riskFactor)
      .dividedBy(
        balance
          .plus(netLoans)
          .plus(maxSpent)
          .minus(insuranceReserveBalance)
          .minus(collateral)
      )
  );
}
