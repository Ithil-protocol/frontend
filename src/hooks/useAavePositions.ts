import { useEffect, useState } from "react";

import { aaveABI } from "@/abi";
import { publicClient } from "@/wagmiTest/config";

interface Positions {
  open: any[];
  closed: any[];
}

export const useAavePositions = () => {
  const [positions, setPositions] = useState<Positions>({
    open: [],
    closed: [],
  });

  useEffect(() => {
    const fn = async () => {
      const positionOpenedFilter = await publicClient.createContractEventFilter(
        {
          abi: aaveABI,
          eventName: "PositionOpened",
          fromBlock: 0n,
        }
      );
      const positionClosedFilter = await publicClient.createContractEventFilter(
        {
          abi: aaveABI,
          eventName: "PositionClosed",
          fromBlock: 0n,
        }
      );
      const positionOpenedLogs = await publicClient.getFilterLogs({
        filter: positionOpenedFilter,
      });
      const positionClosedLogs = await publicClient.getFilterLogs({
        filter: positionClosedFilter,
      });

      const positionsClosedLogsObj: Record<string, any> = {};

      positionClosedLogs.forEach((position) => {
        const key = position.args.id!.toString();
        positionsClosedLogsObj[key] = position;
      });

      const openPositions = positionOpenedLogs.filter(
        (position) => !positionsClosedLogsObj[position.args.id!.toString()]
      );

      setPositions({
        open: openPositions,
        closed: positionClosedLogs,
      });
    };
    fn();
  }, []);

  return positions;
};
