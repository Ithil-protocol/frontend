import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { palette } from "@/styles/theme/palette";
import { ServiceType } from "@/types";
import { pickColor } from "@/utils/theme";

import ServiceIcon from "../Service/ServiceIcon";

interface ServiceCardProps {
  assets: string[];
  description: string | ((assets: string[]) => string);
  to: string;
  multiplier: string;
  name: string;
  apy: string;
  tvl: string;
}

const ServiceCard: FC<ServiceCardProps> = ({
  assets,
  description,
  to,
  multiplier,
  name,
  apy,
  tvl,
}) => {
  const { colorMode } = useColorMode();
  const { push } = useRouter();
  return (
    <Box className="flex flex-col p-7 rounded-xl bg-primary-100">
      <HStack className="flex justify-between mb-6">
        <ServiceIcon name={name as ServiceType} />
        {/* 1 - 10% multiplier */}
        <Box className="flex items-center gap-1 px-2 py-1 border rounded-md border-primary-500">
          <Icon
            icon="ph:lightning-fill"
            color={colorMode === "dark" ? "white" : "black"}
          ></Icon>
          <Text textStyle="slender-sm">{multiplier}</Text>
        </Box>
      </HStack>
      <Heading size="h3" className="mb-6">
        {name}
      </Heading>
      <HStack
        alignItems="center"
        justifyContent="center"
        width="full"
        spacing="8px"
        paddingY="12px"
        borderRadius="6px"
        marginBottom="16px"
        marginX="auto"
        className="bg-primary-600"
      >
        <Text textStyle="md2">Best APY</Text>
        <Text textStyle="slender-md">{apy}</Text>
      </HStack>
      <Text className="mb-4">
        {typeof description === "string" ? description : description(assets)}
      </Text>
      <VStack align="start">
        <HStack spacing="8px" marginBottom="16px">
          <Text
            textStyle="sm"
            color={pickColor(colorMode, palette.colors.primary, "700")}
          >
            TVL:
          </Text>
          <Text textStyle="slender-sm2">{tvl}</Text>
        </HStack>
        {/* tokens array */}
        <Box className="flex flex-wrap gap-2 mb-6 justify-evenly">
          {assets.map((token, index) => (
            <Box
              key={token + index}
              className="flex py-1 min-w-[92px] border border-primary-500 rounded-md"
            >
              <Text
                textStyle="slender-sm"
                fontWeight="normal"
                className="mx-auto"
              >
                {token.toUpperCase()}
              </Text>
            </Box>
          ))}
        </Box>
      </VStack>
      <Button
        onClick={() => push(`/services/${to}`)}
        size="lg"
        className="w-full"
      >
        Enter
      </Button>
    </Box>
  );
};

export default ServiceCard;
