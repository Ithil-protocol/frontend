import { Box, HStack, Heading, Text } from "@chakra-ui/react";
import { FC } from "react";

import { Service, ServiceName } from "@/types";

import ServiceIcon from "./ServiceIcon";

interface Props {
  service: Service;
}

const ServiceHeading: FC<Props> = ({ service }) => {
  return (
    <div className="flex flex-row gap-2 p-5 rounded-xl bg-primary-100">
      <div className="flex flex-col w-full gap-3">
        <HStack className="flex justify-between w-full mb-6">
          <Heading size="h1b" lineHeight="32px">
            {service.label}
          </Heading>
          <Box className="relative flex justify-end">
            <ServiceIcon name={service.name as ServiceName} width="50" />
          </Box>
        </HStack>
        <Text textStyle="sm">{service.description}</Text>
      </div>
    </div>
  );
};

export default ServiceHeading;
