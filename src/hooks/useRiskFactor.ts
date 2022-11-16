import { Contract } from '@ethersproject/contracts';
import { useCall } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useCheckValidChain } from './index';

import { StrategyContractType } from 'src/global/types';

export function useRiskFactor(
  strategy: StrategyContractType,
  tokenAddress: string
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        strategy && {
          contract: new Contract(strategy.address, strategy.abi),
          method: 'riskFactors',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return new BigNumber(0);
  }
  return new BigNumber(value?.[0].toString() ?? '0');
}
