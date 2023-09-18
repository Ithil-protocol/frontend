import { Address } from "viem";

import contracts from "@/deploy/contracts.json";
import { AssetEssential } from "@/types";

export const ithil: AssetEssential = {
  name: "ITHIL",
  label: "ITHIL",
  coingeckoId: "ithil",
  iconName: "ithil",
  decimals: 18,
  tokenAddress: contracts.ithil as Address,
};
