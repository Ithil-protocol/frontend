import { useMemo } from 'react';

import { useClosedPositions } from './useClosedPositions';
import { useLiquidatedPositions } from './useLiquidatedPositions';
import { useOpenedPositions } from './useOpenedPositions';
import { useChainId } from '.';

import { STRATEGIES } from '@/global/ithil';

export function useFilterdPositions(
  filter: 'active' | 'closed' | 'liquidated'
) {
  const chainId = useChainId();
  const openedMarginPositions = useOpenedPositions(
    STRATEGIES[chainId].MarginTradingStrategy
  );
  const openedYearnPositions = useOpenedPositions(
    STRATEGIES[chainId].YearnStrategy
  );
  const openedBalancerPositions = useOpenedPositions(
    STRATEGIES[chainId].BalancerStrategy
  );
  const closedMarginPositions = useClosedPositions(
    STRATEGIES[chainId].MarginTradingStrategy
  );
  const closedYearnPositions = useClosedPositions(
    STRATEGIES[chainId].YearnStrategy
  );
  const closedBalancerPositions = useClosedPositions(
    STRATEGIES[chainId].BalancerStrategy
  );
  const liquidatedMarginPositions = useLiquidatedPositions(
    STRATEGIES[chainId].MarginTradingStrategy
  );
  const liquidatedYearnPositions = useLiquidatedPositions(
    STRATEGIES[chainId].YearnStrategy
  );
  const liquidatedBalancerPositions = useLiquidatedPositions(
    STRATEGIES[chainId].BalancerStrategy
  );

  const openedPositions = useMemo(
    () => [
      ...openedMarginPositions,
      ...openedYearnPositions,
      ...openedBalancerPositions,
    ],
    [openedBalancerPositions, openedMarginPositions, openedYearnPositions]
  );
  const closedPositions = useMemo(
    () => [
      ...closedMarginPositions,
      ...closedYearnPositions,
      ...closedBalancerPositions,
    ],
    [closedBalancerPositions, closedMarginPositions, closedYearnPositions]
  );

  const liquidatedPositions = useMemo(
    () => [
      ...liquidatedMarginPositions,
      ...liquidatedYearnPositions,
      ...liquidatedBalancerPositions,
    ],
    [
      liquidatedBalancerPositions,
      liquidatedMarginPositions,
      liquidatedYearnPositions,
    ]
  );

  const filteredPositions = useMemo(() => {
    if (!openedPositions || !closedPositions || !liquidatedPositions)
      return null;
    switch (filter) {
      case 'active':
        return openedPositions.filter(
          (position) =>
            closedPositions.findIndex((cPos) => position.id === cPos.id) ===
              -1 && !liquidatedPositions.includes(position.id)
        );
      case 'closed':
        return openedPositions.filter(
          (position) =>
            closedPositions.findIndex((cPos) => position.id === cPos.id) !== -1
        );
      case 'liquidated':
        return openedPositions.filter((position) =>
          liquidatedPositions.includes(position.id)
        );
    }
  }, [openedPositions, closedPositions, filter, liquidatedPositions]);

  return filteredPositions;
}
