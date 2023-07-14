import { Address } from "viem";

import aave from "./aave.json";

type AaveAssets = typeof aave;

interface Aave extends Omit<AaveAssets, "assets"> {
  assets: {
    name: string;
    coingeckoId: string;
    iconName: string;
    decimals: number;
    tokenAddress: Address;
    aTokenAddress: Address;
  }[];
}

export default aave as Aave;
