import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import MarginTradingStrategyABI from '@ithil-protocol/deployed/goerli/abi/MarginTradingStrategy.json';
import {
  useCall,
  useContractFunction,
  useEthers,
  useLogs,
} from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useCheckValidChain, useHandleTxStatus } from './index';

import { GOERLI_ADDRESSES } from '@/global/constants';
import { OpenedPositionType } from '@/global/types';

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

export function useComputePairRiskFactor(srcToken: string, destToken: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.MarginTradingStrategy && {
          contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
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

export function useClosePosition() {
  const { send, state, resetState } = useContractFunction(
    GOERLI_ADDRESSES.MarginTradingStrategy &&
      new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
    'closePosition'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    closePosition: send,
  };
}

export function usePositons(positionId: number) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        GOERLI_ADDRESSES.MarginTradingStrategy && {
          contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
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

export function useOpenedPositions() {
  /** 
  id,
  msg.sender,
  order.spentToken,
  order.obtainedToken,
  collateralToken,
  order.collateral,
  toBorrow,
  amountIn,
  interestRate,
  block.timestamp
    */
  const { account } = useEthers();
  const isValid = useCheckValidChain();
  const logs = useLogs(
    isValid && {
      contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
      event: 'PositionWasOpened',
      args: [],
    },
    {
      fromBlock: 0,
      toBlock: 'latest',
    }
  );

  if (!account) return [];

  return (
    logs?.value
      ?.filter((log) => log.data.owner === account)
      .map(
        (log) =>
          ({
            id: log.data.id.toString(),
            owedToken: log.data.owedToken,
            heldToken: log.data.heldToken,
            collateralToken: log.data.collateralToken,
            collateral: log.data.collateral,
            principal: log.data.principal,
            allowance: log.data.allowance,
            interestRate: log.data.interestRate,
            fees: log.data.fees,
            createdAt: log.data.createdAt,
          } as OpenedPositionType)
      ) || []
  );
}

export function useClosedPositions() {
  const { account } = useEthers();
  const isValid = useCheckValidChain();
  const logs = useLogs(
    isValid && {
      contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
      event: 'PositionWasClosed',
      args: [],
    },
    {
      fromBlock: 0,
      toBlock: 'latest',
    }
  );

  if (!account) return [];

  return logs?.value?.map((log) => log.data.id.toString()) || [];
}

export function useLiquidatedPositions() {
  const { account } = useEthers();
  const isValid = useCheckValidChain();
  const logs = useLogs(
    isValid && {
      contract: new Contract(GOERLI_ADDRESSES.MarginTradingStrategy, abi),
      event: 'PositionWasLiquidated',
      args: [],
    },
    {
      fromBlock: 0,
      toBlock: 'latest',
    }
  );

  if (!account) return [];

  return logs?.value?.map((log) => log.data.id.toString()) || [];
}
