import { Contract } from '@ethersproject/contracts';
import { useEthers, useLogs } from '@usedapp/core';
import { OpenedPositionType } from '@/global/types';
import { useCheckValidChain } from './index';

export function useOpenedPositions(strategy: any) {
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
