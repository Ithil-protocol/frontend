import { GridItem, Heading, VStack } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import PositionsDetailItem from "./PositionsDetailItem";

interface Props {
  collateral: string;
  currentPrice: string;
  distanceFromLiquid: string;
  liquidPrice: string;
  loan: string;
  opened: string;
  openPrice: string;
  profit: string;
}

const PositionsDetails: React.FC<Props> = ({
  collateral,
  currentPrice,
  distanceFromLiquid,
  liquidPrice,
  loan,
  opened,
  openPrice,
  profit,
}) => {
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
        <Heading
          as="h2"
          fontWeight={700}
          fontSize="18px"
          lineHeight="24px"
          className="font-sans"
        >
          Positions Details
        </Heading>
        <VStack spacing="24px" width="full">
          <PositionsDetailItem title="Loan" unit="ETH 2x Long" value={loan} />
          <PositionsDetailItem
            title="Open Price"
            unit="USDC"
            value={openPrice}
          />
          <PositionsDetailItem
            title="Current Price"
            unit="USDC"
            value={currentPrice}
          />
          <PositionsDetailItem
            title="Liq. Price"
            unit="USDC"
            value={liquidPrice}
          />
          <PositionsDetailItem
            title="Collateral"
            unit="ETH"
            value={collateral}
          />
          <PositionsDetailItem
            title="Distance From Liq."
            unit="ETH"
            value={distanceFromLiquid}
          />
          <PositionsDetailItem
            title="Profit"
            valueColor="#15ac89"
            value={profit}
          />
          <PositionsDetailItem title="Opened" value={opened} />
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
