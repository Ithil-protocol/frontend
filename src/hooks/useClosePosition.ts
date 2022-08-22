import { Contract } from '@ethersproject/contracts';
import { useContractFunction } from '@usedapp/core';
import { useCheckValidChain, useHandleTxStatus } from './index';

export function useClosePosition(strategy: any) {
  const isValid = useCheckValidChain();

  const { send, state, resetState } = useContractFunction(
    isValid && strategy && new Contract(strategy.address, strategy.abi),
    'closePosition'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    closePosition: send,
  };
}
