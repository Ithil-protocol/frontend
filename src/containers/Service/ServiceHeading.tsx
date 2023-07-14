import { Heading, Text } from "@chakra-ui/react";
import { FC } from "react";

import { ServiceType } from "@/types";

import ServiceIcon from "./ServiceIcon";

interface Props {
  data: {
    name: string;
    description?: string;
  };
}

const ServiceHeading: FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-row gap-2 p-5 rounded-xl bg-primary-100">
      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row justify-between">
          <Heading size="h1b" lineHeight="32px">
            {data.name}
          </Heading>
          <ServiceIcon name={data.name as ServiceType} />
        </div>
        <Text textStyle="sm">{data.description}</Text>
      </div>
    </div>
  );
};

export default ServiceHeading;
