import { Contract } from '@ethersproject/contracts';
import { useEthers, useLogs } from '@usedapp/core';

import { useCheckValidChain } from './index';

import { OpenedPositionType, StrategyContractType } from '@/global/types';

export function useOpenedPositions(strategy: StrategyContractType) {
  /**
   * @brief Position Data
   * @param id,
   * @param msg.sender,
   * @param order.spentToken,
   * @param order.obtainedToken,
   * @param collateralToken,
   * @param order.collateral,
   * @param toBorrow,
   * @param amountIn,
   * @param interestRate,
   * @param block.timestamp
   */
  const { account } = useEthers();
  const isValid = useCheckValidChain();
  const logs = useLogs(
    isValid &&
      strategy && {
        contract: new Contract(strategy.address, strategy.abi),
        event: 'PositionWasOpened',
        args: [null, account],
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
            id: `${log.data.id.toString()}_${strategy.type}`,
            owedToken: log.data.owedToken,
            heldToken: log.data.heldToken,
            collateralToken: log.data.collateralToken,
            collateral: log.data.collateral,
            principal: log.data.principal,
            allowance: log.data.allowance,
            interestRate: log.data.interestRate,
            fees: log.data.fees,
            createdAt: log.data.createdAt,
            type: strategy.type,
            label: strategy.label,
          } as OpenedPositionType)
      ) || []
  );
}
