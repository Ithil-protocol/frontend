import { useQuery } from "@tanstack/react-query";

import { aaveABI, gmxABI } from "@/abi";
import { publicClient } from "@/wagmiTest/config";

export const useAaveClosePositions = () => {
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

export const useGmxClosePositions = () => {
  const result = useQuery({
    queryKey: ["closed-positions"],
    queryFn: async () => {
      const positionClosedFilter = await publicClient.createContractEventFilter(
        {
          abi: gmxABI,
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

export const useClosePositions = () => {
  const { data: aave = [] } = useAaveClosePositions();
  const { data: gmx = [] } = useGmxClosePositions();

  const aaveWithTypes = aave.map((item) => ({
    ...item,
    type: "AAVE",
  }));

  const gmxWithTypes = gmx.map((item) => ({
    ...item,
    type: "GMX",
  }));

  const positions = [aaveWithTypes, gmxWithTypes].flat().sort((a, b) => {
    return (
      new Date(Number(b?.agreement?.createdAt)).getTime() -
      new Date(Number(a?.agreement?.createdAt)).getTime()
    );
  });

  console.log("postions44", positions);

  return positions;
};
