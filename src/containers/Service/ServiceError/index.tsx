import { HStack } from "@chakra-ui/react";

import FreeLiquidityError from "./FreeLiquidityError";
import InterestError from "./InterestError";

interface Props {
  isInterestError: boolean;
  isFreeLiquidityError: boolean;
}

const ServiceError: React.FC<Props> = ({
  isInterestError,
  isFreeLiquidityError,
}) => {
  return (
    <HStack>
      {isInterestError && <InterestError />}
      {isFreeLiquidityError && <FreeLiquidityError />}
    </HStack>
  );
};

export default ServiceError;
