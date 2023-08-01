import React from "react";
import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface Props {
  price: number;
}

const LineChart = ({ price }: Props) => {
  const data = [{ name: "", price }];

  const domainMax = price * 2;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <YAxis
          type="number"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          ticks={Array.from({ length: 5 }, (_, i) => i * (domainMax / 4))}
          tickFormatter={(tick: number) => tick.toFixed(2)}
          // domain={[0, (dataMax: number) => dataMax * 2]}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="price" fill="transparent" />
        <ReferenceLine y={price} stroke="#077ce0" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
