import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import YearnStrategyABI from '@ithil-protocol/deployed/goerli/abi/YearnStrategy.json';
import {
  useCall,
  // useContractFunction,
  // useEthers,
  // useLogs,
} from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useCheckValidChain } from './index';

import { GOERLI_ADDRESSES } from '@/global/constants';

const abi = new Interface(YearnStrategyABI);

export function useQuote(
  srcToken: string,
  destToken: string,
  amount: BigNumber
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.YearnStrategy && {
          contract: new Contract(GOERLI_ADDRESSES.YearnStrategy, abi),
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
