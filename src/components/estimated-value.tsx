import dynamic from "next/dynamic";
import { type FC } from "react";
import { type Address } from "wagmi";

import { usePriceData } from "@/hooks/use-price-data.hook";
import { type Token } from "@/types/onchain.types";
import { estimateTokenValue } from "@/utils/input.utils";

interface EstimatedValueProps {
  value: bigint | undefined;
  token: Token;
}

export const EstimatedValue: FC<EstimatedValueProps> = ({ value, token }) => {
  const { data: priceData } = usePriceData();

  return (
    <>
      ${" "}
      {estimateTokenValue(
        value,
        token.decimals,
        priceData?.[token.tokenAddress.toLowerCase() as Address]?.usd
      )}
    </>
  );
};

export const DynamicEstimatedValue = dynamic(
  async () =>
    await import("@/components/estimated-value").then(
      (mod) => mod.EstimatedValue
    ),
  { ssr: false }
);
