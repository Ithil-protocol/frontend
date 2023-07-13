import { Heading, Text } from "@chakra-ui/react";
import { FC } from "react";

import { Aave } from "@/assets/svgs";
import { aaveService } from "@/data/aaveService";

interface Props {
  token: string;
}

const ServiceHeading: FC<Props> = ({ token }) => {
  return (
    <div className="flex flex-row gap-2 p-5 rounded-xl bg-primary-100">
      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row justify-between">
          <Heading size="h1b" lineHeight="32px">
            {aaveService.name}
          </Heading>
          <Aave width={40} height={40} />
        </div>
        <Text textStyle="sm">{aaveService.description}</Text>
      </div>
    </div>
  );
};

export default ServiceHeading;
