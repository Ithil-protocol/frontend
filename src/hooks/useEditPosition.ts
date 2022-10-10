import { Contract } from '@ethersproject/contracts';
import { useContractFunction } from '@usedapp/core';

import { useCheckValidChain, useHandleTxStatus } from './index';

import { StrategyContractType } from '@/global/types';

export function useEditPosition(strategy: StrategyContractType) {
  const isValid = useCheckValidChain();

  const { send, state, resetState } = useContractFunction(
    isValid && strategy && new Contract(strategy.address, strategy.abi),
    'editPosition'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    editPosition: send,
    state,
  };
}
