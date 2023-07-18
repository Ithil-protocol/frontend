import { chartPools } from "@/data/defillama";
import { ChartPoint } from "@/types";

interface FetchResponse {
  status: string;
  data: ChartPoint[];
}

export const getChart = async (token: string) => {
  const pool = chartPools[token.toUpperCase()];

  if (!pool) throw new Error();

  const res = await fetch("https://yields.llama.fi/chart/" + pool);
  const fetchResponse: FetchResponse = await res.json();

  const formattedData = fetchResponse.data.map((item) => ({
    // date: formatDate(new Date(item.timestamp)),
    date: item.timestamp,
    tvl: item.tvlUsd,
    apy: item.apyBase,
  }));

  return formattedData;
};
