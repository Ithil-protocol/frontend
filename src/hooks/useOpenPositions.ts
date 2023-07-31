import { formatUnits } from "viem";
import { Address, useContractReads } from "wagmi";

import { aaveABI, gmxABI } from "@/abi";
import { OpenPosition } from "@/types";
import { getAssetByAddress } from "@/utils";

import { aaveAddress } from "./generated/aave";
import { gmxAddress } from "./generated/gmx";
import {
  useGetAaveAgreementsByUser,
  useGetFixedYieldAgreementsByUser,
  useGetGmxAgreementsByUser,
} from "./useGetAgreementByUser";

export const useAaveOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetAaveAgreementsByUser();

  const positions: OpenPosition[] = [];

  const quoteContracts = data?.[0]?.map((agreement) => ({
    abi: aaveABI,
    address: aaveAddress[98745] as Address,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: aaveABI,
    address: aaveAddress[98745] as Address,
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

    const isPnlLoading =
      isQuotesLoading || isFeesLoading || isAgreementsLoading;

    const pnl = !isPnlLoading ? quote - fee - amount! - margin! : undefined;

    const tokenAddress = agreement?.loans[0].token;

    const asset = tokenAddress && getAssetByAddress(tokenAddress);

    const decimals = asset ? asset.decimals : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      quote,
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
      isPnlLoading,
      type: "AAVE",
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
export const useGmxOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetGmxAgreementsByUser();

  const positions: OpenPosition[] = [];

  const quoteContracts = data?.[0]?.map((agreement) => ({
    abi: gmxABI,
    address: gmxAddress[98745] as Address,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: gmxABI,
    address: gmxAddress[98745] as Address,
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

  const isPnlLoading = isQuotesLoading || isFeesLoading || isAgreementsLoading;

  const length = data?.[0].length || 0;

  for (let i = 0; i < length; i++) {
    const agreement = data?.[0][i];
    const amount = agreement?.loans[0].amount;
    const margin = agreement?.loans[0].margin;
    const quoteResult = quotes?.[i].result as unknown[] as bigint[];
    const quote = quoteResult?.[0];
    const feeResult = fees?.[i].result as unknown[] as bigint[];
    const fee = feeResult?.[0];

    const pnl = !isPnlLoading ? quote - fee - amount! - margin! : undefined;

    const tokenAddress = agreement?.loans[0].token;
    const asset = tokenAddress && getAssetByAddress(tokenAddress);

    const decimals = asset ? asset.decimals : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      quote,
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
      isPnlLoading,
      type: "GMX",
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
export const useFixedYieldOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } =
    useGetFixedYieldAgreementsByUser();

  console.log("data333", data);

  const positions: OpenPosition[] = [];

  const length = data?.[0].length || 0;

  for (let i = 0; i < length; i++) {
    const agreement = data?.[0][i];
    positions.push({
      agreement,
      id: data?.[1][i],
      type: "FixedYield",
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
