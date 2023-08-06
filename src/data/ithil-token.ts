import { Address } from "viem";

import contracts from "@/deploy/contracts.json";

export const ithil = {
  name: "ITHIL",
  coingeckoId: "ithil",
  iconName: "ithil",
  decimals: 18,
  tokenAddress: contracts.ithil as Address,
};
