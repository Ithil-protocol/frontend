import { useQuery } from "@tanstack/react-query";

import { aaveABI } from "@/abi";
import { publicClient } from "@/wagmiTest/config";

export const useClosePositions = () => {
  const result = useQuery({
    queryKey: ["closed-positions"],
    queryFn: async () => {
      const positionClosedFilter = await publicClient.createContractEventFilter(
        {
          abi: aaveABI,
          eventName: "PositionClosed",
          fromBlock: 0n,
        }
      );
      const positionClosedLogs = await publicClient.getFilterLogs({
        filter: positionClosedFilter,
      });

      return positionClosedLogs;
    },
  });

  return {
    ...result,
    data: result?.data?.map((item) => item.args),
  };
};
