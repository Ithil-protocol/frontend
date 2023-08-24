import { Address, formatEther, parseUnits } from "viem";
import { useContractRead } from "wagmi";

import { aaveABI } from "@/abi";
import { Token } from "@/types/onchain.types";
import { fixPrecision, getAssetByAddress, multiplyBigInt } from "@/utils";

import { useVaultFreeLiquidity } from "./generated/vault";

const spreadToUint256 = (base: bigint, spread: bigint) => {
  return ((base * 101n) / 100n) * BigInt(2 ** 128) + (spread * 101n) / 100n;
};
const displayInterestSpread = (base: bigint, spread: bigint) => {
  const result = formatEther(base + spread);
  return fixPrecision(Number(result) * 100, 2);
};
export const reverseDisplayInterestSpreadInPercent = (
  interestAndSpread: bigint
) => {
  const twoPow128 = BigInt(2 ** 128);
  const base = interestAndSpread % twoPow128;
  const spread = interestAndSpread / twoPow128;
  let result = (base + spread).toString();
  result = formatEther(base + spread);
  return fixPrecision(Number(result) * 100, 2);
};

interface AaveRateAndSpreadProps {
  token: Token;
  leverage: string;
  margin: string;
  slippage: string;
  serviceAddress: Address;
}

export const useRateAndSpread = ({
  token,
  leverage,
  margin,
  slippage,
  serviceAddress,
}: AaveRateAndSpreadProps) => {
  const bigintMargin =
    margin !== "" && margin !== "0" ? parseUnits(margin, token.decimals) : 1n;
  const loan = multiplyBigInt(bigintMargin, +leverage);

  const asset = getAssetByAddress(token.tokenAddress);
  const { data: vaultFreeLiquidity, isLoading: isFreeLiquidityLoading } =
    useVaultFreeLiquidity({
      address: asset?.vaultAddress as Address,
      enabled: !!asset,
    });

  const {
    data,
    isLoading: isBaseRateLoading,
    isError,
  } = useContractRead({
    abi: aaveABI,
    address: serviceAddress,
    functionName: "computeBaseRateAndSpread",
    args: [
      token.tokenAddress,
      loan,
      bigintMargin,
      vaultFreeLiquidity as bigint,
    ],
    enabled: !!vaultFreeLiquidity,
  });

  const isLoading = isBaseRateLoading || isFreeLiquidityLoading;

  const result = {
    interestAndSpread: 0n,
    displayInterestAndSpreadInPercent: 0,
    isInterestAndSpreadLoading: isLoading,
    isInterestError: false,
    isFreeLiquidityError: false,
  };

  if (vaultFreeLiquidity) {
    result.isFreeLiquidityError = loan > vaultFreeLiquidity;
  }

  if (data) {
    result.interestAndSpread = spreadToUint256(...data);
    result.displayInterestAndSpreadInPercent = displayInterestSpread(...data);
    result.isInterestError =
      data[0] + data[1] >
      (BigInt(1e18) * BigInt(1000 - Number(slippage) * 1000)) / 1000n;
    return result;
  }
  // or throw an error to stop user from opoenning position
  return result;
};
