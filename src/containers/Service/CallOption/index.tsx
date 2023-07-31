import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useChart } from "@/hooks/defillama";
import { useBaseApy } from "@/hooks/useBaseApy";
import { getAssetByName, getServiceByName, getSingleQueryParam } from "@/utils";

import SafetyScore from "../SafetyScore";
import ServiceHeading from "../ServiceHeading";
import { Graph } from "../graph";
import Form from "./Form";

const CallOption = () => {
  const {
    query: { asset: token },
  } = useRouter();
  const { data: chartData } = useChart("");
  const { isLoading } = useBaseApy(getSingleQueryParam(token));

  const normalizedToken = getSingleQueryParam(token);

  const asset = getAssetByName(normalizedToken);

  const service = getServiceByName("call-option");
  if (!service) return null;
  return (
    <Box className="grid w-full grid-cols-10 gap-6">
      <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
        <ServiceHeading
          data={{ name: service.name, description: service.description }}
        />
        <Graph data={chartData} tab="apy" />
        {/* <StrategyDescription
          description={service.explanation}
          address={"0x9F1C69E1874d44Ad4ce79079C0b7Bd35E7882Ba80"}
          baseApy={0}
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

export default CallOption;
