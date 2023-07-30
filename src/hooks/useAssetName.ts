import { useRouter } from "next/router";

export const useAssetName = () => {
  const router = useRouter();

  return (router.query.asset as string | undefined) || "";
};
