import { Address, parseUnits } from "viem";
import { useContractRead } from "wagmi";

import { aaveABI } from "@/abi";
import { Asset } from "@/types";

interface Props {
  asset: Asset;
  serviceAddress: Address;
  abi: typeof aaveABI;
  inputAmount: string;
}

export const useMinMarginLimit = ({
  abi,
  asset,
  serviceAddress,
  inputAmount,
}: Props) => {
  const { data: minMargin, isLoading: isMinMarginLoading } = useContractRead({
    args: [asset.tokenAddress],
    address: serviceAddress,
    abi,
    functionName: "minMargin",
  });
  const bigintAmount = parseUnits(inputAmount ?? "0", asset.decimals);
  const isLessThanMinimumMarginError = minMargin
    ? bigintAmount < minMargin
    : false;

  return { isLessThanMinimumMarginError, isMinMarginLoading, bigintAmount };
};
