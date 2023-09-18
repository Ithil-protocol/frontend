import { HStack } from "@chakra-ui/react";

import FreeLiquidityError from "./FreeLiquidityError";
import InterestError from "./InterestError";
import LessThanMinimumMarginError from "./LessThanMinimumMarginError";

interface Props {
  isInterestError: boolean;
  isFreeLiquidityError: boolean;
  isLessThanMinimumMarginError?: boolean;
}

const ServiceError: React.FC<Props> = ({
  isInterestError,
  isFreeLiquidityError,
  isLessThanMinimumMarginError,
}) => {
  return (
    <HStack>
      {isInterestError && <InterestError />}
      {isFreeLiquidityError && <FreeLiquidityError />}
      {isLessThanMinimumMarginError && <LessThanMinimumMarginError />}
    </HStack>
  );
};

export default ServiceError;
