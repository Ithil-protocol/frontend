import { useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';
import { useCheckValidChain } from './index';

export function useQuoter(
  srcToken: string,
  destToken: string,
  amount: BigNumber,
  strategy: any
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        strategy && {
          contract: new Contract(strategy.address, strategy.abi),
          method: 'quote',
          args: [srcToken, destToken, amount.toFixed()],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return new BigNumber(0);
  }
  return new BigNumber(value?.[0].toString() ?? '0');
}
