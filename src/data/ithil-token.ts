import { Address } from "viem";

import contracts from "@/deploy/contracts.json";
import { Ithil } from "@/types";

export const ithil: Ithil = {
  name: "ITHIL",
  label: "ITHIL",
  coingeckoId: "ithil",
  iconName: "ithil",
  decimals: 18,
  tokenAddress: contracts.ithil as Address,
};
