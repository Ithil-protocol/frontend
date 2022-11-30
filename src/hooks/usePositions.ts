import { Contract } from '@ethersproject/contracts';
import { useCall } from '@usedapp/core';

import { useCheckValidChain } from './index';

import { StrategyContractType } from 'src/global/types';

export function usePositions(
  positionId: number,
  strategy?: StrategyContractType
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        strategy &&
        positionId && {
          contract: new Contract(strategy.address, strategy.abi),
          method: 'positions',
          args: [positionId],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return null;
  }
  return value;
}
