import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import MockTokenABI from '@ithil-protocol/deployed/goerli/abi/MockToken.json';
import { useCall, useContractFunction, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';

import { useHandleTxStatus } from './index';

import { RedeemTokenInfoType } from '@/global/types';

const abi = new Interface(MockTokenABI);

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

export function useRedeem(token: RedeemTokenInfoType) {
  const { account } = useEthers();
  const contract = useMemo(
    () => token && token.address && new Contract(token.address, abi),
    [token]
  );

  const { send, state, resetState } = useContractFunction(contract, 'mint');
  const isLoading = useHandleTxStatus(state, resetState);

  useEffect(() => {
    if (account && token && token.id) send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    isLoading,
  };
}
