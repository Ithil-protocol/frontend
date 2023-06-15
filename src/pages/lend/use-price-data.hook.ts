import { useQuery } from "@tanstack/react-query";
import type { Address } from "wagmi";

import vaults from "@/deploy/vaults.json";
import { type LendingTokenList } from "@/types/onchain.types";

export const lendingTokens = vaults as LendingTokenList;

export type CoingeckoSimpleTokenPrice = Record<Address, { usd: number }>;

export const fetchTokenData = async (
  tokenAddressList: Address[],
  chainId = "arbitrum-one",
  vsCurrency = "usd"
) => {
  const params = {
    contract_addresses: tokenAddressList.join(","),
    vs_currencies: vsCurrency,
  };
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/${chainId}?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token data");
  }

  return (await response.json()) as CoingeckoSimpleTokenPrice;
};

export const usePriceData = () => {
  const addressList = lendingTokens.map((token) => token.tokenAddress);
  return useQuery(
    ["tokenData", lendingTokens],
    async () => await fetchTokenData(addressList),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );
};
