import { Contract } from '@ethersproject/contracts';
import { useCall, useContractFunction, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { useHandleTxStatus } from './index';

import { RedeemTokenInfoType } from '@/global/types';
import { ERC20ABI } from '@/global/constants';

export function useAllowance(tokenAddress: string, spenderAddress: string) {
  const { account } = useEthers();
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, ERC20ABI),
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
    tokenAddress && new Contract(tokenAddress, ERC20ABI),
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
    () => token && token.address && new Contract(token.address, ERC20ABI),
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

export function useTotalSupply(tokenAddress: string) {
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, ERC20ABI),
        method: 'totalSupply',
        args: [],
      }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return new BigNumber(0);
  }
  return new BigNumber(value?.[0].toString() ?? '0');
}
