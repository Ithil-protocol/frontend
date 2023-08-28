import { useChart } from "./defillama";

export const useBaseApy = (token: string) => {
  const { data, isLoading } = useChart(token);
  const baseApy = data?.[data?.length - 3].apy;

  return {
    baseApy,
    isLoading,
  };
};
