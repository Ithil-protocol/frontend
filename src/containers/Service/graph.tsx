import { Box, Heading } from "@chakra-ui/react";
import classNames from "classnames";
import { useState } from "react";

import Chart from "@/components/chart";
import { ChartDataPoint } from "@/types";
import { isWithinIntervalDaysAgo } from "@/utils";
import { formatDate } from "@/utils/date.utils";

type graphWindows = "All" | "1M" | "1W";
type graphSections = "TVL" | "APY";
type Tab = "apy" | "tvl" | "all";

interface Props {
  data?: ChartDataPoint[];
  tab?: Tab;
}

const tabObj: {
  [key: string]: graphSections[];
} = {
  apy: ["APY"],
  tvl: ["TVL"],
  all: ["TVL", "APY"],
};

export const Graph = ({ data, tab = "all" }: Props) => {
  const [graphWindow, setGraphWindow] = useState<graphWindows>("All");
  const [graphSection, setGraphSection] = useState<graphSections>("APY");

  // const windowClassnames = "p-2.5 rounded-xl cursor-pointer";
  const windowChoices: graphWindows[] = ["All", "1M", "1W"];

  const sectionClassnames = "p-2.5 rounded-xl cursor-pointer";
  const sectionChoices: graphSections[] = ["TVL", "APY"];
  const tabs = tabObj[tab];

  const filteredData =
    graphWindow === "1W"
      ? isWithinIntervalDaysAgo(data, 7)
      : graphWindow === "1M"
      ? isWithinIntervalDaysAgo(data, 30)
      : data;

  return (
    <div className="p-5 rounded-xl bg-primary-100">
      <Box
        flexDirection={{
          base: "column",
          sm: "row",
        }}
        className="flex items-center justify-between gap-4"
      >
        <Heading size="h2">Historical Rate</Heading>
        <Box gap="10px" className="flex flex-row gap-4 py-1 overflow-hidden">
          <div className="py-2.5 px-[3px] rounded-xl bg-primary-200">
            {windowChoices.map((choice) => (
              <span
                className={classNames(sectionClassnames, {
                  "bg-primary-300": graphWindow === choice,
                })}
                onClick={() => setGraphWindow(choice)}
                key={choice}
              >
                {choice}
              </span>
            ))}
          </div>
          <div className="py-2.5 px-[3px] rounded-xl bg-primary-200">
            {tabs.map((choice) => (
              <span
                className={classNames(sectionClassnames, {
                  "bg-primary-300": graphSection === choice,
                })}
                onClick={() => setGraphSection(choice)}
                key={choice}
              >
                {choice}
              </span>
            ))}
          </div>
        </Box>
      </Box>

      <div className="pt-4 h-96">
        <Chart
          data={filteredData}
          xKey="date"
          yKey={graphSection === "APY" ? "apy" : "tvl"}
          dataKey={graphSection === "APY" ? "apy" : "tvl"}
          xTickFormatter={(date: Date) => formatDate(new Date(date))}
        />
      </div>
    </div>
  );
};
