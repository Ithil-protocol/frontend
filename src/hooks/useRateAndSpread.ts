import { Address, formatEther } from "viem";

import { fixPrecision, getVaultByTokenAddress } from "@/utils";

import { useAaveComputeBaseRateAndSpread } from "./generated/aave";
import { useGmxBaseRisks, useGmxRiskSpreads } from "./generated/gmx";
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
  tokenAddress: Address;
  loan: bigint;
  margin: bigint;
}

export const useAaveRateAndSpread = ({
  tokenAddress,
  loan,
  margin,
}: AaveRateAndSpreadProps) => {
  const vault = getVaultByTokenAddress(tokenAddress);
  // console.log("ii", vault);
  const { data: vaultFreeLiquidity, isLoading: isFreeLiquidityLoading } =
    useVaultFreeLiquidity({
      address: vault?.vaultAddress as Address,
      enabled: !!vault,
    });

  const { data, isLoading: isBaseRateLoading } =
    useAaveComputeBaseRateAndSpread({
      args: [tokenAddress, loan, margin, vaultFreeLiquidity as bigint],
      enabled: !!vaultFreeLiquidity,
    });

  console.log(
    "ii",
    "vaultFreeLiquidity:",
    vaultFreeLiquidity,
    "loan:",
    loan,
    "margin:",
    margin
  );
  console.log("ii2", data);
  const isLoading = isBaseRateLoading || isFreeLiquidityLoading;

  const result = {
    interestAndSpread: 0n,
    displayInterestAndSpreadInPercent: 0,
    isInterestAndSpreadLoading: isLoading,
  };
  if (data) {
    result.interestAndSpread = spreadToUint256(...data);
    result.displayInterestAndSpreadInPercent = displayInterestSpread(...data);
    return result;
  }
  // or throw an error to stop user from opoenning position
  return result;
};

interface GmxRateAndSpreadProps {
  tokenAddress: Address;
  loan: bigint;
  margin: bigint;
}

export const useGmxRateAndSpread = ({
  tokenAddress,
  loan,
  margin,
}: GmxRateAndSpreadProps) => {
  const { data: baseRisk, isLoading: isBaseRateLoading } = useGmxBaseRisks({
    args: [tokenAddress],
  });
  const { data: riskSpreads, isLoading: isRiskSpreadsLoading } =
    useGmxRiskSpreads({
      args: [tokenAddress],
    });

  const riskSpreadWithLeverage =
    riskSpreads && margin !== 0n ? (riskSpreads * loan) / margin : 0n;

  const isLoading = isBaseRateLoading || isRiskSpreadsLoading;

  const result = {
    interestAndSpread: 0n,
    displayInterestAndSpreadInPercent: 0,
    isInterestAndSpreadLoading: isLoading,
  };
  if (baseRisk && riskSpreads) {
    result.interestAndSpread = spreadToUint256(
      baseRisk,
      riskSpreadWithLeverage
    );
    result.displayInterestAndSpreadInPercent = displayInterestSpread(
      baseRisk,
      riskSpreadWithLeverage
    );
    return result;
  }
  // or throw an error to stop user from opoenning position
  return result;
};
