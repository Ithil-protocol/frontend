import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'bignumber.js';
import { DEFAULT_SUPPORTED_CHAINS, Goerli } from '@usedapp/core';

import { BALANCER_POOLS, STRATEGIES, TOKEN_LIST } from './ithil';
import { TokenDetails } from './types';

export function infuraUrl(chainId: number) {
  const chainName =
    DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)
      ?.chainName || Goerli.chainName;

  return `https://${chainName.toLowerCase()}.infura.io/v3/${
    process.env.REACT_APP_INFURA_KEY
  }`;
}

export function alchemyUrl(chainId: number) {
  const chainName =
    DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)
      ?.chainName || Goerli.chainName;

  return `https://eth-${chainName.toLowerCase()}.g.alchemy.com/v2/${
    process.env.REACT_APP_ALCHEMY_KEY
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

export function getTokenByAddress(tokenAddress: string, chainId: number) {
  return TOKEN_LIST[chainId].find((token) => token.address === tokenAddress);
}

export function getStrategyByType(type: string, chainId: number) {
  const filtered = Object.keys(STRATEGIES[chainId]).filter(
    (id) => STRATEGIES[chainId][id].type === type
  );
  if (!filtered.length) return undefined;
  return STRATEGIES[chainId][filtered[0]];
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
  borrowed: BigNumber,
  riskFactor: BigNumber
) {
  return baseFee.plus(
    netLoans
      .plus(
        BigNumber.max(netLoans.minus(insuranceReserveBalance), 0).plus(borrowed)
      )
      .multipliedBy(riskFactor)
      .dividedBy(
        balance.plus(netLoans).plus(borrowed).minus(insuranceReserveBalance)
      )
  );
}

export function shortenString(str: string) {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
}

export function getPoolNameByAddress(address: string) {
  return BALANCER_POOLS.filter(
    (pool) => pool.address.toLocaleLowerCase() === address.toLocaleLowerCase()
  )[0]?.name;
}

export function getExplorerAddressLink(address: string, chainId: number) {
  switch (chainId) {
    case Goerli.chainId:
      return Goerli.getExplorerAddressLink(address);
    default:
      return address;
  }
}

export function getExplorerTransactionLink(tx: string, chainId: number) {
  switch (chainId) {
    case Goerli.chainId:
      return Goerli.getExplorerTransactionLink(tx);
    default:
      return tx;
  }
}

export async function addTenderlyChain() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      window.ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x539',
              chainName: 'Tenderly(Localhost)',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [
                'https://rpc.tenderly.co/fork/261f0c8d-5e1d-4797-bfb6-389820b020a6',
              ],
            },
          ],
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }
  }
}
