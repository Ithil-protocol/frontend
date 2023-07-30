import { useRouter } from "next/router";

import { getSingleQueryParam } from "@/utils";

export const useAssetName = () => {
  const router = useRouter();

  return getSingleQueryParam(router.query.asset);
};
