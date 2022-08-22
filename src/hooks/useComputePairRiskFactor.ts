import { useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';

import { useCheckValidChain } from './index';

export function useComputePairRiskFactor(
  srcToken: string,
  destToken: string,
  strategy: any
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        strategy.address && {
          contract: new Contract(strategy.address, strategy.abi),
          method: 'computePairRiskFactor',
          args: [srcToken, destToken],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return new BigNumber(0);
  }
  return new BigNumber(value?.[0].toString() ?? '0');
}
