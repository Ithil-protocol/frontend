import { useQuery } from "@tanstack/react-query";

import * as api from "@/api/defillama";

export const useChartAave = (token: string) => {
  return useQuery({
    queryKey: ["aave-chart", token],
    queryFn: () => api.getChartAave(token),
  });
};
