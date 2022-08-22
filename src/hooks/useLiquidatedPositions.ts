import { Contract } from '@ethersproject/contracts';
import { useEthers, useLogs } from '@usedapp/core';
import { useCheckValidChain } from './index';

export function useLiquidatedPositions(strategy: any) {
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
      fromBlock: 0,
      toBlock: 'latest',
    }
  );

  if (!account) return [];

  return logs?.value?.map((log) => log.data.id.toString()) || [];
}
