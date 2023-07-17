import { Address, formatEther, parseUnits } from "viem";

import { Token } from "@/types/onchain.types";
import { fixPrecision, getVaultByTokenAddress } from "@/utils";

import { useGmxComputeBaseRateAndSpread } from "./generated/gmx";
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
}

export const useRateAndSpread = ({
  token,
  leverage,
  margin,
  slippage,
}: AaveRateAndSpreadProps) => {
  const loan = parseUnits(
    `${Number(margin) * Number(leverage)}`,
    token.decimals
  );
  const bigintMargin = parseUnits(margin, token.decimals);
  const vault = getVaultByTokenAddress(token.tokenAddress);
  const { data: vaultFreeLiquidity, isLoading: isFreeLiquidityLoading } =
    useVaultFreeLiquidity({
      address: vault?.vaultAddress as Address,
      enabled: !!vault,
    });

  const { data, isLoading: isBaseRateLoading } = useGmxComputeBaseRateAndSpread(
    {
      args: [
        token.tokenAddress,
        loan,
        bigintMargin,
        vaultFreeLiquidity as bigint,
      ],
      enabled: !!vaultFreeLiquidity,
    }
  );

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
