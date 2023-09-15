import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import { publicClient } from "@/wagmiTest/config";

export const useAaveClosePositions = () => {
  const { address: accountAddress } = useAccount();
  const result = useQuery({
    queryKey: ["aave-closed-positions", accountAddress],
    queryFn: async () => {
      const positionClosedFilter = await publicClient.createContractEventFilter(
        {
          abi: aaveABI,
          eventName: "PositionClosed",
          fromBlock: 0n,
          args: { user: accountAddress },
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
  const { address: accountAddress } = useAccount();
  const result = useQuery({
    queryKey: ["gmx-closed-positions", accountAddress],
    queryFn: async () => {
      const positionClosedFilter = await publicClient.createContractEventFilter(
        {
          abi: gmxABI,
          eventName: "PositionClosed",
          fromBlock: 0n,
          args: { user: accountAddress },
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
  const { data: aave = [], isLoading: isLoadingAave } = useAaveClosePositions();
  const { data: gmx = [], isLoading: isLoadingGmx } = useGmxClosePositions();

  const aaveWithTypes = aave.map((item) => ({
    ...item,
    type: "aave" as const,
  }));

  const gmxWithTypes = gmx.map((item) => ({
    ...item,
    type: "gmx" as const,
  }));

  const positions = [aaveWithTypes, gmxWithTypes].flat().sort((a, b) => {
    return (
      new Date(Number(b?.agreement?.createdAt)).getTime() -
      new Date(Number(a?.agreement?.createdAt)).getTime()
    );
  });

  return {
    positions,
    isLoading: isLoadingAave || isLoadingGmx,
  };
};
