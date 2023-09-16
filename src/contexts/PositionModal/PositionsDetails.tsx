import { GridItem, VStack } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import { Data } from "../types";
import PositionsDetailItem from "./PositionsDetailItem";

interface Props {
  collateral?: string;
  currentPrice?: string;
  distanceFromLiquid?: string;
  liquidPrice?: string;
  loan?: string;
  data: Data;
}

const PositionsDetails: React.FC<Props> = ({ data }) => {
  const { pickColor } = useColorMode();

  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      bg={pickColor(palette.colors.primary, "100")}
    >
      <VStack alignItems="start" spacing="40px" height="full">
        <VStack spacing="24px" width="full">
          <PositionsDetailItem
            title="Position"
            value={data.position.toUpperCase()}
          />
          <PositionsDetailItem
            title="Amount"
            postfix={data.token.toUpperCase()}
            value={data.amount}
          />
          <PositionsDetailItem
            title="Leverage"
            postfix="x"
            value={data.leverage}
          />
          <PositionsDetailItem
            title="Slippage"
            postfix="%"
            value={data.slippage}
          />
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
