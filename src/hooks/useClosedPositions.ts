import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import { publicClient } from "@/wagmiTest/config";

import { aaveAddress } from "./generated/aave";
import { gmxAddress } from "./generated/gmx";

export const useAaveClosedPositions = () => {
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
          address: aaveAddress,
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

export const useGmxClosedPositions = () => {
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
          address: gmxAddress,
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

export const useClosedPositions = () => {
  const { data: aave = [], isLoading: isLoadingAave } =
    useAaveClosedPositions();
  const { data: gmx = [], isLoading: isLoadingGmx } = useGmxClosedPositions();

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
