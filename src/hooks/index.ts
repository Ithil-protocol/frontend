import { Goerli, TransactionStatus, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

export function useCheckValidChain() {
  const { chainId } = useEthers();

  return !!chainId && chainId === Goerli.chainId;
}

export function useHandleTxStatus(
  state: TransactionStatus,
  resetState: () => void,
  successMessage = 'Trade executed and confirmed!'
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
