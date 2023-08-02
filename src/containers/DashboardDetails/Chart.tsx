import { GridItem } from "@chakra-ui/react";

import CustomChart from "@/components/chart";
import fakeChartData from "@/data/fakeData.json";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";
import { formatDate } from "@/utils/date.utils";

interface GraphDataPoint {
  date: string;
  tvl: number | string;
}

const graphData = fakeChartData.data.map<GraphDataPoint>((item, _key) => ({
  date: formatDate(new Date(item.timestamp)),
  tvl: item.tvlUsd,
}));

const Chart = () => {
  const { pickColor } = useColorMode();

  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      bg={pickColor(palette.colors.primary, "100")}
      area="main"
      className="w-[99.5%] md:w-full h-full"
    >
      <CustomChart data={graphData} xKey="date" yKey="tvl" dataKey="tvl" />
    </GridItem>
  );
};
export default Chart;
