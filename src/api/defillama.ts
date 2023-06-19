import { aaveChartPools } from "@/data/defillama";
import { formatDate } from "@/utils/date.utils";

interface Response {
  timestamp: Date;
  tvlUsd: number;
  apyBase: number;
}

interface FetchResponse {
  status: string;
  data: Response[];
}

export const getChartAave = async (token: string) => {
  const pool = aaveChartPools[token.toUpperCase()];

  if (!pool) throw new Error();

  const res = await fetch("https://yields.llama.fi/chart/" + pool);
  const fetchResponse: FetchResponse = await res.json();

  const formattedData = fetchResponse.data.map((item) => ({
    date: formatDate(new Date(item.timestamp)),
    tvl: item.tvlUsd,
    apy: item.apyBase,
  }));

  return formattedData;
};
