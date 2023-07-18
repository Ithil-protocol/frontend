import { useQuery } from "@tanstack/react-query";

import * as api from "@/api/defillama";

export const useChart = (token: string) => {
  return useQuery({
    queryKey: ["chart", token],
    queryFn: () => api.getChart(token),
  });
};
