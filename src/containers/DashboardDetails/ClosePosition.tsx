import { Button, GridItem, HStack, Text, VStack } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

const ClosePosition = () => {
  const { mode, pickColor } = useColorMode();

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
      className="font-sans"
    >
      <VStack spacing="40px">
        <HStack alignItems="center" justifyContent="space-between" width="full">
          <Text
            fontWeight="light"
            fontSize="16px"
            lineHeight="24px"
            color={pickColor(palette.colors.primary, "700")}
          >
            Position Value
          </Text>
          <HStack spacing="16px">
            <Text
              fontWeight="black"
              fontSize="16px"
              lineHeight="24px"
              color={pickColor(palette.colors.primary, "800")}
            >
              USDC
            </Text>
            <Text
              fontWeight="black"
              fontSize="16px"
              lineHeight="24px"
              color={mode("primary.main.dark", "primary.main")}
            >
              500
            </Text>
          </HStack>
        </HStack>
        <Button
          bg={pickColor(palette.colors.primary, "500")}
          color={pickColor(palette.safety, "red")}
        >
          Close Position
        </Button>
      </VStack>
    </GridItem>
  );
};

export default ClosePosition;
