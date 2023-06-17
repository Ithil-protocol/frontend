import { GridItem, Heading, VStack, useColorMode } from "@chakra-ui/react";

import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

import PositionsDetailItem from "./PositionsDetailItem";

const PositionsDetails = () => {
  const { colorMode } = useColorMode();

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
      bg={pickColor(colorMode, palette.colors.primary, "100")}
    >
      <VStack alignItems="start" spacing="40px" height="full">
        <Heading
          as="h2"
          fontWeight={700}
          fontSize={"18px"}
          lineHeight={"24px"}
          className="font-sans"
        >
          Positions Details
        </Heading>
        <VStack spacing="24px" width="full">
          <PositionsDetailItem
            title="Position"
            unit="ETH 2x Long"
            value="8.05"
          />
          <PositionsDetailItem title="Open Price" unit="USDC" value="4.122" />
          <PositionsDetailItem
            title="Current Price"
            unit="USDC"
            value="4.122"
          />
          <PositionsDetailItem title="Liq. Price" unit="USDC" value="4.122" />
          <PositionsDetailItem title="Collateral" unit="ETH" value="1.00" />
          <PositionsDetailItem
            title="Distance From Liq."
            unit="ETH"
            value="+ 0.05"
          />
          <PositionsDetailItem
            title="Profit"
            valueColor="#15ac89"
            value="$ 2.400.00 (+24.1 %)"
          />
          <PositionsDetailItem title="Opened" value="05/01/2023" />
        </VStack>
      </VStack>
    </GridItem>
  );
};

export default PositionsDetails;
