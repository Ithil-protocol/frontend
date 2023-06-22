import { Heading } from "@chakra-ui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

import Chart from "@/components/chart";
import { useChartAave } from "@/hooks/defillama";
import { isWithinIntervalDaysAgo } from "@/utils";
import { formatDate } from "@/utils/date.utils";

type graphWindows = "All" | "1M" | "1W";
type graphSections = "TVL" | "APY";

export const Graph = () => {
  const {
    query: { asset },
  } = useRouter();

  const { data } = useChartAave(asset as string);

  const [graphWindow, setGraphWindow] = useState<graphWindows>("All");
  const [graphSection, setGraphSection] = useState<graphSections>("APY");

  const windowClassnames = "px-3 py-2 rounded-xl cursor-pointer";
  const windowChoices: graphWindows[] = ["All", "1M", "1W"];

  const sectionClassnames = "px-3 py-1 rounded-xl cursor-pointer";
  const sectionChoices: graphSections[] = ["TVL", "APY"];

  const filteredData =
    graphWindow === "1W"
      ? isWithinIntervalDaysAgo(data, 7)
      : graphWindow === "1M"
      ? isWithinIntervalDaysAgo(data, 30)
      : data;

  console.log(filteredData);

  return (
    <div className="p-5 rounded-xl bg-primary-100">
      <div className="flex flex-row items-center justify-between gap-4">
        <Heading size="h2">Historical Rate</Heading>
        <div className="flex flex-row gap-4 py-1 overflow-hidden rounded-xl bg-primary-200">
          {windowChoices.map((choice) => (
            <div
              className={classNames(windowClassnames, {
                "bg-primary-300": graphWindow === choice,
              })}
              onClick={() => setGraphWindow(choice)}
              key={choice}
            >
              {choice}
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-4 py-2 overflow-hidden rounded-xl bg-primary-200">
          {sectionChoices.map((choice) => (
            <div
              className={classNames(sectionClassnames, {
                "bg-primary-300": graphSection === choice,
              })}
              onClick={() => setGraphSection(choice)}
              key={choice}
            >
              {choice}
            </div>
          ))}
        </div>
      </div>

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
