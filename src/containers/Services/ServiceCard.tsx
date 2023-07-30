import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { FC } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";
import { ServiceName } from "@/types";

import ServiceIcon from "../Service/ServiceIcon";
import EnterButton from "./EnterButton";

interface ServiceCardProps {
  assets: string[];
  description: string | ((assets: string[]) => string);
  to: string;
  multiplier: string;
  label: string;
  name: ServiceName;
  apy: string;
  tvl: string;
  hasIndex: boolean;
}

const ServiceCard: FC<ServiceCardProps> = ({
  apy,
  assets,
  description,
  hasIndex,
  multiplier,
  label,
  to,
  tvl,
  name,
}) => {
  const tokenModal = useTokenModal();
  const { colorMode, pickColor } = useColorMode();
  const handleEnterClick = () => tokenModal.openDialog(assets, to);

  return (
    <Box className="flex flex-col p-7 rounded-xl bg-primary-100">
      <HStack className="flex justify-between w-full mb-6">
        <Box>
          <ServiceIcon name={name} width="full" />
        </Box>
        {/* 1 - 10% multiplier */}
        <Box className="flex items-center gap-1 px-2 py-1 border rounded-md border-primary-500">
          <Icon
            icon="ph:lightning-fill"
            color={colorMode === "dark" ? "white" : "black"}
          ></Icon>
          <Text textStyle="slender-sm" className="whitespace-nowrap">
            {multiplier}
          </Text>
        </Box>
      </HStack>
      <Heading size="h3" className="mb-6">
        {label}
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
      <Text className="mb-4 ">
        {typeof description === "string" ? description : description(assets)}
      </Text>
      <VStack className="mt-auto" align="start">
        <HStack spacing="8px" marginBottom="16px">
          <Text textStyle="sm" color={pickColor(palette.colors.primary, "700")}>
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
      {hasIndex ? (
        <EnterButton onClick={handleEnterClick} />
      ) : (
        <Link href={`/services/${to}`}>
          <EnterButton />
        </Link>
      )}
    </Box>
  );
};

export default ServiceCard;
