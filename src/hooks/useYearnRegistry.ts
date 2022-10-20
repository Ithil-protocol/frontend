import { Contract } from '@ethersproject/contracts';
import {
  useCall,
  // useContractFunction,
  // useEthers,
  // useLogs,
} from '@usedapp/core';

import { useChainId, useCheckValidChain } from './index';

import { MOCKS } from '@/global/ithil';

export function useLatestVault(tokenAddress: string) {
  const chainId = useChainId();
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        MOCKS[chainId].MockYearnRegistry && {
          contract: new Contract(
            MOCKS[chainId].MockYearnRegistry.address,
            MOCKS[chainId].MockYearnRegistry.abi
          ),
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
