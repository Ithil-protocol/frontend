import { Box } from "@chakra-ui/react";
import { FC } from "react";

import CustomChart from "@/components/chart";

interface Props {
  data: any[];
  graphSection: string;
}

const Chart: FC<Props> = ({ data, graphSection }) => {
  return (
    <Box className="flex-1 p-5 rounded-xl bg-primary-100">
      <div className="h-full pt-4">
        <CustomChart
          data={data}
          xKey="date"
          yKey={graphSection === "APY" ? "apy" : "tvl"}
          dataKey={graphSection === "APY" ? "apy" : "tvl"}
        />
      </div>
    </Box>
  );
};

export default Chart;
