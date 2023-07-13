import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { aaveService } from "@/data/aaveService";
import { useBaseApy } from "@/hooks/useBaseApy";
import { AaveService } from "@/types/onchain.types";

import SafetyScore from "./SafetyScore";
import ServiceHeading from "./ServiceHeading";
import StrategyDescription from "./StrategyDescription";
import { Graph } from "./graph";

interface Props {
  service: AaveService;
}

const ServiceContent: FC<Props> = ({ service }) => {
  const {
    query: { asset: token },
  } = useRouter();
  const { baseApy, isLoading } = useBaseApy(token as string);

  // const services ={
  //   gmx:{},
  //   aave:{}
  // }

  // const service = services[serviceName]

  return (
    <Box className="flex flex-col flex-grow gap-6 col-span-full lg:col-span-7">
      <ServiceHeading token={token as string} />
      <Graph />
      <StrategyDescription
        description="This service simply deposits tokens in the Aave V3 protocol and earns a stable APY through the protocol itself."
        address={service.address}
        baseApy={baseApy}
        boostApy={aaveService.boostApy}
        isLoading={isLoading}
      />
      <SafetyScore
        score={9.3}
        features={aaveService.features}
        description={aaveService.description}
      />
    </Box>
  );
};

export default ServiceContent;
