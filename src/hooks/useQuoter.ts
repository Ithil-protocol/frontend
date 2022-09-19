import { useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';

import { useCheckValidChain } from './index';

import { StrategyContractType } from '@/global/types';

export function useQuoter(
  srcToken: string,
  destToken: string,
  amount: BigNumber,
  strategy: StrategyContractType
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        strategy && {
          contract: new Contract(strategy.address, strategy.abi),
          method: 'quote',
          args: [srcToken, destToken, amount.toFixed(0)],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return null;
  }
  return value?.[0] ? new BigNumber(value[0].toString()) : null;
}
