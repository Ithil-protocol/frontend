import { Box } from "@chakra-ui/react";

import { ithil } from "@/data/other-asset";
import { useChart } from "@/hooks/defillama";
import { useBaseApy } from "@/hooks/useBaseApy";
import { getServiceByName } from "@/utils";

import SafetyScore from "../SafetyScore";
import ServiceHeading from "../ServiceHeading";
import StrategyDescription from "../StrategyDescription";
import { Graph } from "../graph";
import Form from "./Form";

const IthilStaking = () => {
  const { data: chartData } = useChart("");
  const { baseApy, isLoading } = useBaseApy("");
  const service = getServiceByName("ithil-staking");
  if (!service) return null;
  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
        <ServiceHeading service={service} />
        <Graph data={chartData} tab="apy" />
        <StrategyDescription
          description={service.explanation}
          address={"0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba80"}
          baseApy={0}
          isLoading={isLoading}
        />
        <SafetyScore
          score={service.safety_score.score}
          features={service.safety_score.features}
          description={service.safety_score.description}
        />
      </Box>
      <Box className="flex-shrink-0 col-span-full lg:col-span-3">
        <Form asset={ithil} />
      </Box>
    </Box>
  );
};

export default IthilStaking;
