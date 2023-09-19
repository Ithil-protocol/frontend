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

export const frax: AssetEssential = {
  name: "FRAX",
  label: "FRAX",
  coingeckoId: "frax",
  iconName: "frax",
  decimals: 18,
  tokenAddress: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F" as Address,
};
