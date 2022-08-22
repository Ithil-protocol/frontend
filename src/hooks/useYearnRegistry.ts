import { Contract } from '@ethersproject/contracts';
import {
  useCall,
  // useContractFunction,
  // useEthers,
  // useLogs,
} from '@usedapp/core';

import { useCheckValidChain } from './index';

import { MOCKS } from '@/global/constants';

export function useLatestVault(tokenAddress: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        MOCKS.MockYearnRegistry && {
          contract: new Contract(
            MOCKS.MockYearnRegistry.address,
            MOCKS.MockYearnRegistry.abi
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
