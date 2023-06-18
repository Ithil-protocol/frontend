import { Heading } from "@chakra-ui/react";
import classNames from "classnames";
import { useState } from "react";

import Chart from "@/components/chart";
import fakeChartData from "@/data/fakeData.json";
import { formatDate } from "@/utils/date.utils";

type graphWindows = "3m" | "1m" | "1w";
type graphSections = "TVL" | "APY";

interface GraphDataPoint {
  time: number;
  date: string;
  value: number;
}

const graphData = fakeChartData.map<GraphDataPoint>(({ t, v }) => ({
  date: formatDate(new Date(t * 10)),
  value: v * 1000,
  time: t,
}));
export const Graph = () => {
  const [graphWindow, setGraphWindow] = useState<graphWindows>("3m");
  const [graphSection, setGraphSection] = useState<graphSections>("APY");

  const windowClassnames = "px-3 py-2 rounded-xl cursor-pointer";
  const windowChoices: graphWindows[] = ["3m", "1m", "1w"];

  const sectionClassnames = "px-3 py-1 rounded-xl cursor-pointer";
  const sectionChoices: graphSections[] = ["TVL", "APY"];

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
        <Chart data={graphData} xKey="date" yKey="value" />
      </div>
    </div>
  );
};
