import { formatUnits } from "viem";
import { Address, useContractReads } from "wagmi";

import ServiceAbi from "@/abi/Service.abi";
import { getVaultByTokenAddress } from "@/utils";

import { serviceAddress } from "./generated/service";
import { useGetAgreementsByUser } from "./useGetAgreementByUser";

export const useOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetAgreementsByUser();

  const positions = [];

  // console.log(
  //   "data333",
  //   data?.[0]?.map((agreement) => ({
  //     abi: ServiceAbi,
  //     address: "0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba8" as Address,
  //     functionName: "quote",
  //     args: [agreement],
  //   }))
  // );

  const quoteContracts = data?.[0]?.map((agreement) => ({
    abi: ServiceAbi,
    address: serviceAddress[42161] as Address,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: ServiceAbi,
    address: serviceAddress[42161] as Address,
    functionName: "computeDueFees",
    args: [agreement],
  }));

  const { data: quotes, isLoading: isQuotesLoading } = useContractReads({
    contracts: quoteContracts,
    enabled: !!data,
  });

  const { data: fees, isLoading: isFeesLoading } = useContractReads({
    contracts: feeContracts,
    enabled: !!data,
  });

  const length = data?.[0].length || 0;

  for (let i = 0; i < length; i++) {
    const agreement = data?.[0][i];
    const amount = agreement?.loans[0].amount;
    const margin = agreement?.loans[0].margin;
    const quoteResult = quotes?.[i].result as unknown[] as bigint[];
    const quote = quoteResult?.[0];
    const feeResult = fees?.[i].result as unknown[] as bigint[];
    const fee = feeResult?.[0];

    const pnl =
      quote !== undefined &&
      fee !== undefined &&
      amount !== undefined &&
      margin !== undefined
        ? quote - fee - amount - margin
        : undefined;

    const tokenAddress = agreement?.loans[0].token;
    const decimals = tokenAddress
      ? getVaultByTokenAddress(tokenAddress).decimals
      : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
