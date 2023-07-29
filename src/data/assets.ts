import assetsJson from "@/deploy/assets.json";
import { Asset } from "@/types";
import { convertArrayByKeyToOBJ } from "@/utils";

export const assets = assetsJson as Asset[];

export const assetsObjByName = convertArrayByKeyToOBJ(assets, "name");
export const assetsObjByAddress = convertArrayByKeyToOBJ(
  assets,
  "tokenAddress"
);
