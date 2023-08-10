import { formatUnits } from "viem";
import { useAccount, useContractRead, useContractReads } from "wagmi";

import { aaveABI, callOptionABI, gmxABI } from "@/abi";
import { assets } from "@/data/assets";
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
    address: aaveAddress,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: aaveABI,
    address: aaveAddress,
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
      type: "aave",
      name: "AAVE",
      slippage: 0.1,
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
    address: gmxAddress,
    functionName: "quote",
    args: [agreement],
  }));

  const feeContracts = data?.[0]?.map((agreement) => ({
    abi: gmxABI,
    address: gmxAddress,
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
      type: "gmx",
      name: "GMX",
      slippage: 10,
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

  const positions: OpenPosition[] = [];

  const length = data?.[0].length || 0;

  for (let i = 0; i < length; i++) {
    const agreement = data?.[0][i];
    positions.push({
      agreement,
      id: data?.[1][i],
      type: "fixed-yield",
      name: "Fixed yield",
      slippage: 0,
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};

export const useCallOptionOpenPositions = () => {
  const { address } = useAccount();

  const { data: userAgreements0, isLoading: isLoading0 } = useContractRead({
    account: address,
    abi: callOptionABI,
    address: assets[0].callOptionAddress,
    functionName: "getUserAgreements",
    enabled: !!address,
  });

  const { data: userAgreements1, isLoading: isLoading1 } = useContractRead({
    account: address,
    abi: callOptionABI,
    address: assets[1].callOptionAddress,
    functionName: "getUserAgreements",
    enabled: !!address,
  });

  const { data: userAgreements2, isLoading: isLoading2 } = useContractRead({
    account: address,
    abi: callOptionABI,
    address: assets[2].callOptionAddress,
    functionName: "getUserAgreements",
    enabled: !!address,
  });

  const { data: userAgreements3, isLoading: isLoading3 } = useContractRead({
    account: address,
    abi: callOptionABI,
    address: assets[3].callOptionAddress,
    functionName: "getUserAgreements",
    enabled: !!address,
  });

  const userAgreements = [
    userAgreements0,
    userAgreements1,
    userAgreements2,
    userAgreements3,
  ];

  const isLoading = isLoading0 || isLoading1 || isLoading2 || isLoading3;

  const positions: OpenPosition[] = [];

  userAgreements?.forEach((service) => {
    if (!service) return;
    const [agreements, ids] = service;
    agreements?.forEach((agreement, index) => {
      positions.push({
        agreement,
        id: ids?.[index],
        type: "call-option",
        name: "Call option",
        slippage: 0,
      });
    });
  });

  return {
    positions,
    isLoading,
  };
};
