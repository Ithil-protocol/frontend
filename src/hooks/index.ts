import { Goerli, Localhost, TransactionStatus, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { IS_HARDHAT_SET } from '@/config/dapp';

export function useCheckValidChain() {
  const { chainId } = useEthers();

  return (
    !!chainId && (chainId === Goerli.chainId || chainId === Localhost.chainId)
  );
}

export function useChainId() {
  const { chainId } = useEthers();
  return chainId || Goerli.chainId;
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
