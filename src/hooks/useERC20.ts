import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import ERC20ABI from '@ithil-protocol/deployed/goerli/abi/ERC20.json';
import {
  useCall,
  useContractFunction,
  useEthers,
} from '@devneser/usedapp-core';
import { useEffect } from 'react';

import { useHandleTxStatus } from './index';

const abi = new Interface(ERC20ABI);

export function useAllowance(tokenAddress: string, spenderAddress: string) {
  const { account } = useEthers();
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, abi),
        method: 'allowance',
        args: [account, spenderAddress],
      }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
}

export function useApprove(tokenAddress: string) {
  const { send, state, resetState } = useContractFunction(
    tokenAddress && new Contract(tokenAddress, abi),
    'approve'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    approve: send,
  };
}
