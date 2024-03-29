import { Box } from "@chakra-ui/react";

import { useChart } from "@/hooks/defillama";
import { useAssetName } from "@/hooks/useAssetName";
import { useBaseApy } from "@/hooks/useBaseApy";
import { getAssetByName, getServiceByName } from "@/utils";

import SafetyScore from "../SafetyScore";
import ServiceHeading from "../ServiceHeading";
import { Graph } from "../graph";
import Form from "./Form";

const Gmx = () => {
  const { data: chartData } = useChart("GMX");
  const { baseApy, isLoading } = useBaseApy("GMX");
  const assetName = useAssetName();

  const service = getServiceByName("gmx");
  if (!service) return null;

  const asset = getAssetByName(assetName);

  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
        <ServiceHeading service={service} />
        <Graph data={chartData} />
        {/* <StrategyDescription
          description={service.explanation}
          address={"0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba80"}
          baseApy={baseApy}
          boostApy={service.boostApy}
          isLoading={isLoading}
        /> */}
        <SafetyScore
          score={service.safety_score.score}
          features={service.safety_score.features}
          description={service.safety_score.description}
        />
      </Box>
      <Box className="flex-shrink-0 col-span-full lg:col-span-3">
        {asset && <Form asset={asset} />}
      </Box>
    </Box>
  );
};

export default Gmx;
