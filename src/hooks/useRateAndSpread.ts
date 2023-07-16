import { Address, formatEther, parseUnits } from "viem";

import { Token } from "@/types/onchain.types";
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
  token: Token;
  leverage: string;
  margin: string;
}

export const useAaveRateAndSpread = ({
  token,
  leverage,
  margin,
}: AaveRateAndSpreadProps) => {
  const loan = parseUnits(
    `${Number(margin) * Number(leverage)}`,
    token.decimals
  );
  const bigintMargin = parseUnits(margin, token.decimals);
  const vault = getVaultByTokenAddress(token.tokenAddress);
  // console.log("ii", vault);
  const { data: vaultFreeLiquidity, isLoading: isFreeLiquidityLoading } =
    useVaultFreeLiquidity({
      address: vault?.vaultAddress as Address,
      enabled: !!vault,
    });

  const { data, isLoading: isBaseRateLoading } =
    useAaveComputeBaseRateAndSpread({
      args: [
        token.tokenAddress,
        loan,
        bigintMargin,
        vaultFreeLiquidity as bigint,
      ],
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
  token: Token;
  leverage: string;
  margin: string;
}

export const useGmxRateAndSpread = ({
  token,
  leverage,
  margin,
}: GmxRateAndSpreadProps) => {
  const loan = parseUnits(
    `${Number(margin) * Number(leverage)}`,
    token.decimals
  );
  const bigintMargin = parseUnits(margin, token.decimals);

  const { data: baseRisk, isLoading: isBaseRateLoading } = useGmxBaseRisks({
    args: [token.tokenAddress],
  });
  const { data: riskSpreads, isLoading: isRiskSpreadsLoading } =
    useGmxRiskSpreads({
      args: [token.tokenAddress],
    });

  const riskSpreadWithLeverage =
    riskSpreads && bigintMargin !== 0n
      ? (riskSpreads * loan) / bigintMargin
      : 0n;

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
