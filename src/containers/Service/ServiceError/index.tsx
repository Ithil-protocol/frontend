import { HStack } from "@chakra-ui/react";

import FreeLiquidityError from "./FreeLiquidityError";
import InterestError from "./InterestError";
import LessThanMinimumMarginError from "./LessThanMinimumMarginError";
import NegativeFinalAmountAlert from "./NegativeFinalAmountAlert";

interface Props {
  isInterestError?: boolean;
  isFreeLiquidityError?: boolean;
  isLessThanMinimumMarginError?: boolean;
  isFinalAmountIsNegative?: boolean;
}

const ServiceError: React.FC<Props> = ({
  isInterestError,
  isFreeLiquidityError,
  isLessThanMinimumMarginError,
  isFinalAmountIsNegative,
}) => {
  return (
    <HStack>
      {isInterestError && <InterestError />}
      {isFreeLiquidityError && <FreeLiquidityError />}
      {isLessThanMinimumMarginError && <LessThanMinimumMarginError />}
      {isFinalAmountIsNegative && <NegativeFinalAmountAlert />}
    </HStack>
  );
};

export default ServiceError;
