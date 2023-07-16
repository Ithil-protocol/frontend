import { Box } from "@chakra-ui/react";

import aave from "@/data/aave";
import servicesJson from "@/data/services";
import { useChart } from "@/hooks/defillama";
import { useBaseApy } from "@/hooks/useBaseApy";

import SafetyScore from "../SafetyScore";
import ServiceHeading from "../ServiceHeading";
import StrategyDescription from "../StrategyDescription";
import { Graph } from "../graph";
import Form from "./Form";

const Gmx = () => {
  const { data: chartData } = useChart("GMX");
  const { baseApy, isLoading } = useBaseApy("GMX");

  console.log("chartData", chartData);

  const service = servicesJson.find((item) => item.name === "GMX");
  if (!service) return null;
  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
        <ServiceHeading
          data={{ name: service.name, description: service.description }}
        />
        <Graph data={chartData} />
        <StrategyDescription
          description={service.explanation}
          address={"0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba80"}
          baseApy={baseApy}
          boostApy={service.boostApy}
          isLoading={isLoading}
        />
        <SafetyScore
          score={service.safety_score.score}
          features={service.safety_score.features}
          description={service.safety_score.description}
        />
      </Box>
      <Box className="flex-shrink-0 col-span-full lg:col-span-3">
        {/* CHANGE THE NEXT LINE */}
        <Form asset={aave.assets[3]} />
        {/* CHANGE THE PREVIOUS LINE */}
      </Box>
    </Box>
  );
};

export default Gmx;
