import { Asset } from "@/types";

import aave from "./aave.json";

type AaveAssets = typeof aave;

interface Aave extends Omit<AaveAssets, "assets"> {
  assets: Asset[];
}

export const aaveData = aave as Aave;
