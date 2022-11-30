import { Contract } from '@ethersproject/contracts';
import { useEthers, useLogs } from '@usedapp/core';

import { useCheckValidChain } from './index';

import { StrategyContractType } from 'src/global/types';

export function useLiquidatedPositions(strategy: StrategyContractType) {
  const { account } = useEthers();
  const isValid = useCheckValidChain();
  const logs = useLogs(
    isValid &&
      strategy && {
        contract: new Contract(strategy.address, strategy.abi),
        event: 'PositionWasLiquidated',
        args: [],
      },
    {
      fromBlock: 15681755,
      toBlock: 'latest',
    }
  );

  if (!account) return [];

  return (
    logs?.value?.map((log) => `${log.data.id.toString()}_${strategy.type}`) ||
    []
  );
}
