import { Goerli, TransactionStatus, useCall, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import ERC20ABI from '@ithil-protocol/deployed/goerli/abi/ERC20.json';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';

const erc20Abi = new Interface(ERC20ABI);

export function useCheckValidChain() {
  const { chainId } = useEthers();

  return !!chainId && chainId === Goerli.chainId;
}

export function useHandleTxStatus(
  state: TransactionStatus,
  resetState: () => void,
  successMessage = 'Successfully run!'
) {
  const isLoading = useMemo(() => {
    return state.status === 'Mining';
  }, [state]);

  useEffect(() => {
    if (state.status === 'Success') {
      toast.success(successMessage);
      resetState();
    } else if (state.status === 'Exception' || state.status === 'Fail') {
      if (state.errorMessage) {
        toast.error(state.errorMessage);
      }
      resetState();
    }
  }, [state, resetState, successMessage]);

  return isLoading;
}

export function useTotalSupply(tokenAddress: string) {
  const { value, error } =
    useCall(
      tokenAddress && {
        contract: new Contract(tokenAddress, erc20Abi),
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
