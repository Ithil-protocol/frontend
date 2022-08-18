import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import YearnRegistryABI from '@ithil-protocol/deployed/goerli/abi/MockYearnRegistry.json';
import {
  useCall,
  // useContractFunction,
  // useEthers,
  // useLogs,
} from '@usedapp/core';

import { useCheckValidChain } from './index';

import { GOERLI_ADDRESSES } from '@/global/constants';

const abi = new Interface(YearnRegistryABI);

export function useLatestVault(tokenAddress: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.MockYearnRegistry && {
          contract: new Contract(GOERLI_ADDRESSES.MockYearnRegistry, abi),
          method: 'latestVault',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return tokenAddress;
  }
  return (value?.[0] as string) ?? tokenAddress;
}

export function useYvaults(tokenAddress: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.MockYearnRegistry && {
          contract: new Contract(GOERLI_ADDRESSES.MockYearnRegistry, abi),
          method: 'yvaults',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return tokenAddress;
  }
  return (value?.[0] as string) ?? tokenAddress;
}
