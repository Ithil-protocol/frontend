import { HStack } from "@chakra-ui/react";

import InterestError from "./InterestError";

interface Props {
  isInterestError: boolean;
}

const ServiceError: React.FC<Props> = ({ isInterestError }) => {
  return (
    <HStack>
      {isInterestError && <InterestError />}
      {isInterestError && <InterestError />}
    </HStack>
  );
};

export default ServiceError;
