import { Decimal } from "decimal.js";

interface IBestLeverage {
  baseApy?: number;
  latestAndBase?: bigint;
  riskSpreads?: bigint;
}

export const useBestLeverage = ({
  baseApy,
  latestAndBase,
  riskSpreads,
}: IBestLeverage) => {
  const isLoading = !baseApy || !latestAndBase || !riskSpreads;
  if (isLoading)
    return {
      bestLeverage: 0,
      isLoading: true,
    };
  const parsedBaseApy = new Decimal(baseApy).mul(
    new Decimal(10).pow(new Decimal(16))
  );
  const finalLatestAndBase = new Decimal(
    (latestAndBase % BigInt(2) ** BigInt(128)).toString()
  );

  const bestLeverage = new Decimal(
    parsedBaseApy
      .minus(finalLatestAndBase)
      .div(new Decimal(2).mul(riskSpreads.toString()))
  ).plus(1);

  return {
    bestLeverage: bestLeverage.toFixed(1),
    isLoading: false,
  };
};
