import { GridItem, VStack } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import PositionsDetailItem from "./PositionsDetailItem";
import { Data } from "./types";

interface Props {
  data: Data;
  lockTimeText: string;
}

const PositionsDetails: React.FC<Props> = ({ data, lockTimeText }) => {
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
            title="Collateral"
            postfix={data.token.toUpperCase()}
            value={data.collateral}
          />
          {data.leverage && (
            <PositionsDetailItem
              title="Leverage"
              postfix="x"
              value={data.leverage}
            />
          )}
          {data.slippage && (
            <PositionsDetailItem
              title="Slippage"
              postfix="%"
              value={data.slippage}
            />
          )}
          {data.lockTime && (
            <PositionsDetailItem title={lockTimeText} value={data.lockTime} />
          )}
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
