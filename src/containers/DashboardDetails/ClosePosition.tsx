import {
  Button,
  GridItem,
  HStack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

const ClosePosition = () => {
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
      className="font-sans"
    >
      <VStack spacing="40px">
        <HStack alignItems="center" justifyContent="space-between" width="full">
          <Text
            fontWeight="light"
            fontSize="16px"
            lineHeight="24px"
            color={pickColor(colorMode, palette.colors.primary, "700")}
          >
            Position Value
          </Text>
          <HStack spacing="16px">
            <Text
              fontWeight="black"
              fontSize="16px"
              lineHeight="24px"
              color={pickColor(colorMode, palette.colors.primary, "800")}
            >
              USDC
            </Text>
            <Text
              fontWeight="black"
              fontSize="16px"
              lineHeight="24px"
              color={mode(colorMode, "primary.main.dark", "primary.main")}
            >
              500
            </Text>
          </HStack>
        </HStack>
        <Button
          bg={pickColor(colorMode, palette.colors.primary, "500")}
          color={pickColor(colorMode, palette.safety, "red")}
        >
          Close Position
        </Button>
      </VStack>
    </GridItem>
  );
};

export default ClosePosition;
