import { useRouter } from "next/router";

import { AssetName } from "@/types";
import { getSingleQueryParam } from "@/utils";

export const useAssetName = () => {
  const router = useRouter();

  return getSingleQueryParam(router.query.asset).toUpperCase() as AssetName;
};
