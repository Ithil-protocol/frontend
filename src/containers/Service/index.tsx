import { Box } from "@chakra-ui/react";
import { type FC } from "react";

import { type AaveAsset, type AaveService } from "@/types/onchain.types";

import ServiceContent from "./ServiceContent";
import { ServiceDeposit } from "./single-asset-deposit";

interface Props {
  service: AaveService;
  asset: AaveAsset;
}

const ServicePage: FC<Props> = ({ service, asset }) => {
  return (
    <>
      <Box className="grid w-full grid-cols-10 gap-6">
        <ServiceContent service={service} />
        <Box className="flex-shrink-0 col-span-full lg:col-span-3">
          <ServiceDeposit asset={asset} />
        </Box>
      </Box>
    </>
  );
};

export default ServicePage;
