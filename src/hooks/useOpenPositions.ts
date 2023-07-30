import { formatUnits } from "viem";
import { Address, useContractReads } from "wagmi";

import { aaveABI, fixedYieldABI, gmxABI } from "@/abi";
import { getAssetByAddress } from "@/utils";

import { aaveAddress } from "./generated/aave";
import { fixedYieldAddress } from "./generated/fixedYield";
import { gmxAddress } from "./generated/gmx";
import {
  useGetAaveAgreementsByUser,
  useGetFixedYieldAgreementsByUser,
  useGetGmxAgreementsByUser,
} from "./useGetAgreementByUser";

export const useAaveOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetAaveAgreementsByUser();

  const positions = [];

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

  const { data: quotes } = useContractReads({
    contracts: quoteContracts,
    enabled: !!data,
  });

  console.log("quotes22", quotes);

  const { data: fees } = useContractReads({
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

    const asset = tokenAddress && getAssetByAddress(tokenAddress);

    const decimals = asset ? asset.decimals : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      quote,
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
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

  const positions = [];

  // console.log(
  //   "data333",
  //   data?.[0]?.map((agreement) => ({
  //     abi: aaveABI,
  //     address: "0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba8" as Address,
  //     functionName: "quote",
  //     args: [agreement],
  //   }))
  // );

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

  const { data: quotes } = useContractReads({
    contracts: quoteContracts,
    enabled: !!data,
  });

  const { data: fees } = useContractReads({
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
    const asset = tokenAddress && getAssetByAddress(tokenAddress);

    const decimals = asset ? asset.decimals : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      quote,
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
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

  const positions = [];

  const quoteContracts = data?.[0]?.map((agreement) => ({
    abi: fixedYieldABI,
    address: fixedYieldAddress[98745] as Address,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: fixedYieldABI,
    address: fixedYieldAddress[98745] as Address,
    functionName: "computeDueFees",
    args: [agreement],
  }));

  const { data: quotes } = useContractReads({
    contracts: quoteContracts,
    enabled: !!data,
  });

  const { data: fees } = useContractReads({
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

    const asset = tokenAddress && getAssetByAddress(tokenAddress);

    const decimals = asset ? asset.decimals : 1;

    positions.push({
      agreement,
      id: data?.[1][i],
      quote,
      pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
      pnlPercentage:
        pnl !== undefined ? formatUnits(pnl / 100n, decimals) : undefined,
      type: "FixedYield",
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
