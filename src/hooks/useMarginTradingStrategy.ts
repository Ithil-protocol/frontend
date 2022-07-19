import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import MarginTradingStrategyABI from '@ithil-protocol/deployed/goerli/abi/MarginTradingStrategy.json';
import { useCall, useContractFunction } from '@devneser/usedapp-core';
import BigNumber from 'bignumber.js';

import { useCheckValidChain, useHandleTxStatus } from './index';

import { GOERLI_ADDRESSES } from '@/global/constants';

const abi = new Interface(MarginTradingStrategyABI);

export function useQuote(
  srcToken: string,
  destToken: string,
  amount: BigNumber
) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.MarginTradingStrategy && {
          contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
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

export function useOpenPosition() {
  const { send, state, resetState } = useContractFunction(
    GOERLI_ADDRESSES.MarginTradingStrategy &&
      new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
    'openPosition'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    openPosition: send,
  };
}
