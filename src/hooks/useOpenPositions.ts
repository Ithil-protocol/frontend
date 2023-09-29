import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { Address, formatUnits } from "viem";
import { useAccount, useContractReads } from "wagmi";

import { aaveABI, callOptionABI, gmxABI } from "@/abi";
import { OpenPosition } from "@/types";
import {
  convertNamesToAssets,
  getAssetByAddress,
  getServiceByName,
} from "@/utils";

import {
  useGetAaveAgreementsByUser,
  useGetFixedYieldAgreementsByUser,
  useGetGmxAgreementsByUser,
} from "./useGetAgreementByUser";

export const useAaveOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetAaveAgreementsByUser();

  const positions: OpenPosition[] = [];

  const quoteContracts = data?.map((position) => ({
    abi: aaveABI,
    address: position.contractAddress,
    functionName: "quote",
    args: [position.agreement],
  }));

  const feeContracts = data?.map((position) => ({
    abi: aaveABI,
    address: position.contractAddress,
    functionName: "computeDueFees",
    args: [position.agreement],
  }));

  const { data: quotes, isLoading: isQuotesLoading } = useContractReads({
    contracts: quoteContracts,
    enabled: !!data,
  });

  const { data: fees, isLoading: isFeesLoading } = useContractReads({
    contracts: feeContracts,
    enabled: !!data,
  });

  const length = data?.length || 0;

  if (data) {
    for (let i = 0; i < length; i++) {
      const { contractAddress, id, agreement } = data[i];
      const amount = agreement?.loans[0].amount;
      const margin = agreement?.loans[0].margin;
      const quoteResult = quotes?.[i].result as unknown[] as bigint[];
      const quote = quoteResult?.[0] || 0n;
      const feeResult = fees?.[i].result as unknown[] as bigint[];
      const fee = feeResult?.[0] || 0n;

      const isPnlLoading =
        isQuotesLoading || isFeesLoading || isAgreementsLoading;

      const pnl = !isPnlLoading ? quote - fee - amount! - margin! : undefined;

      const tokenAddress = agreement?.loans[0].token;

      const asset = tokenAddress && getAssetByAddress(tokenAddress);

      const decimals = asset ? asset.decimals : 1;

      positions.push({
        contractAddress,
        agreement,
        id,
        quote,
        pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
        // *10000 / 100 => percent with 2 decimal
        pnlPercentage:
          pnl !== undefined && margin !== undefined
            ? (Number((pnl * 10000n) / margin) / 100).toString()
            : undefined,
        isPnlLoading,
        type: "aave",
        name: "AAVE",
      });
    }
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};
export const useGmxOpenPositions = () => {
  const { data, isLoading: isAgreementsLoading } = useGetGmxAgreementsByUser();

  const positions: OpenPosition[] = [];

  const quoteContracts = data?.map((position) => ({
    abi: gmxABI,
    address: position.contractAddress,
    functionName: "quote",
    args: [position.agreement],
  }));

  const feeContracts = data?.map((position) => ({
    abi: gmxABI,
    address: position.contractAddress,
    functionName: "computeDueFees",
    args: [position.agreement],
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

  const length = data?.length || 0;
  if (data) {
    for (let i = 0; i < length; i++) {
      const { contractAddress, id, agreement } = data[i];
      const amount = agreement?.loans[0].amount;
      const margin = agreement?.loans[0].margin;
      const quoteResult = quotes?.[i].result as unknown[] as bigint[];
      const quote = quoteResult?.[0] || 0n;
      const feeResult = fees?.[i].result as unknown[] as bigint[];
      const fee = feeResult?.[0] || 0n;

      const pnl = !isPnlLoading ? quote - fee - amount! - margin! : undefined;

      const tokenAddress = agreement?.loans[0].token;
      const asset = tokenAddress && getAssetByAddress(tokenAddress);

      const decimals = asset ? asset.decimals : 1;

      positions.push({
        contractAddress,
        agreement,
        id,
        quote,
        pnl: pnl !== undefined ? formatUnits(pnl, decimals) : undefined,
        pnlPercentage:
          pnl !== undefined && margin !== undefined
            ? (Number((pnl * 10000n) / margin) / 100).toString()
            : undefined,
        type: "gmx",
        name: "GMX",
      });
    }
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
      contractAddress: "0x" as Address,

      agreement,
      id: data?.[1][i],
      type: "fixed-yield",
      name: "Fixed yield",
    });
  }

  return {
    positions,
    isLoading: isAgreementsLoading,
  };
};

export const useCallOptionOpenPositions = () => {
  const { address } = useAccount();

  const callOptionService = getServiceByName("call-option");

  const assets = convertNamesToAssets(callOptionService.tokens);

  const { data: userAgreements, isLoading } = useQuery({
    queryKey: ["open-position", "call-option"],
    queryFn: async () => {
      const promises = assets.map((asset) => {
        return readContract({
          account: address,
          abi: callOptionABI,
          address: asset.callOptionAddress,
          functionName: "getUserAgreements",
        });
      });
      const results = await Promise.all(promises);

      return results;
    },
    enabled: !!address,
  });

  // const { data: userAgreements0, isLoading: isLoading0 } = useContractRead({
  //   account: address,
  //   abi: callOptionABI,
  //   address: assets[0].callOptionAddress,
  //   functionName: "getUserAgreements",
  //   enabled: !!address,
  // });

  // const { data: userAgreements1, isLoading: isLoading1 } = useContractRead({
  //   account: address,
  //   abi: callOptionABI,
  //   address: assets[1].callOptionAddress,
  //   functionName: "getUserAgreements",
  //   enabled: !!address,
  // });

  // const { data: userAgreements2, isLoading: isLoading2 } = useContractRead({
  //   account: address,
  //   abi: callOptionABI,
  //   address: assets[2].callOptionAddress,
  //   functionName: "getUserAgreements",
  //   enabled: !!address,
  // });

  // const { data: userAgreements3, isLoading: isLoading3 } = useContractRead({
  //   account: address,
  //   abi: callOptionABI,
  //   address: assets[3].callOptionAddress,
  //   functionName: "getUserAgreements",
  //   enabled: !!address,
  // });

  // const userAgreements = [
  //   userAgreements0,
  //   userAgreements1,
  //   userAgreements2,
  //   userAgreements3,
  // ];

  // console.log("userAgreementsuserAgreements", userAgreements);

  // const isLoading = isLoading0 || isLoading1 || isLoading2 || isLoading3;

  const positions: OpenPosition[] = [];

  userAgreements?.forEach((service) => {
    if (!service) return;
    const [agreements, ids] = service;
    agreements?.forEach((agreement, index) => {
      positions.push({
        contractAddress: "0x" as Address,

        agreement,
        id: ids?.[index],
        type: "call-option",
        name: "Call option",
      });
    });
  });

  return {
    positions,
    isLoading,
  };
};
