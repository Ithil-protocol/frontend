import { useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

import ToolTip from "./ToolTip";

interface Props {
  data: any[] | undefined;
  xKey: string;
  yKey: string;
  dataKey: string;
}

const Chart: FC<Props> = ({ data, xKey, yKey, dataKey }) => {
  const { colorMode } = useColorMode();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        syncId="anyId"
        margin={{
          left: 30,
          right: 50,
        }}
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#077ce0" stopOpacity={0.8} />
            <stop offset="75%" stopColor="#077ce0" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="basis"
          dataKey={dataKey}
          stroke={pickColor(colorMode, palette.variants.primary, "action")}
          fill="url(#chartFill)"
          activeDot={{ fill: "#077ce0", r: 4 }}
          strokeWidth={3}
        />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          dataKey={yKey}
          tickLine={false}
          axisLine={false}
          orientation="right"
          tickMargin={40}
          tickFormatter={(value) => `%${value / 100}`}
        />
        <CartesianGrid
          strokeDasharray="10"
          horizontal={false}
          strokeWidth={2.5}
          repeatCount={30}
          strokeOpacity={0.04}
        />

        <Tooltip content={<ToolTip />} cursor={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default Chart;
