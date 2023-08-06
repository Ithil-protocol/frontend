import Decimal from "decimal.js";
import { formatUnits } from "viem";

import { Asset } from "@/types";

import {
  useCallOptionCurrentPrice,
  useCallOptionTotalAllocation,
} from "./generated/callOption";

interface Props {
  asset: Asset;
  amount?: string;
  month: number;
  enabled?: boolean;
}

export const useCallOptionInfo = ({
  asset,
  amount,
  month,
  enabled = true,
}: Props) => {
  const { data: currentPrice, isLoading: isCurrentPriceLoading } =
    useCallOptionCurrentPrice({
      address: asset.callOptionAddress,
      enabled,
    });
  const { data: allocation, isLoading: isAllocationLoading } =
    useCallOptionTotalAllocation({
      address: asset.callOptionAddress,
      enabled,
    });

  const isLoading = isCurrentPriceLoading || isAllocationLoading;

  const inputDecimal = new Decimal(amount || 0),
    monthDecimal = new Decimal(month);

  let allocationDecimal = new Decimal(0),
    currentPriceDecimal = new Decimal(0),
    virtualAmount = new Decimal(0),
    finalPrice = new Decimal(0),
    finalAmount = new Decimal(0),
    redeem = new Decimal(0),
    amount1 = new Decimal(0);

  if (!enabled)
    return {
      redeem,
      amount1,
      finalAmount,
    };

  currentPriceDecimal = new Decimal(
    formatUnits(currentPrice || 0n, asset.decimals)
  );
  allocationDecimal = new Decimal(formatUnits(allocation || 0n, 18));
  virtualAmount = inputDecimal
    .mul(new Decimal(2).pow(monthDecimal.div(12)))
    .div(currentPriceDecimal);

  finalPrice = currentPriceDecimal
    .mul(allocationDecimal)
    .div(allocationDecimal.minus(virtualAmount));

  finalAmount = inputDecimal
    .mul(new Decimal(2).pow(monthDecimal.div(12)))
    .div(finalPrice);

  amount1 = finalAmount
    .mul(new Decimal("0.95"))
    .mul(new Decimal(10).pow(new Decimal(asset.decimals)));

  redeem = inputDecimal.div(finalAmount);

  return {
    isLoading,
    amount1,
    finalAmount,
    redeem,
  };
};
