import { HStack, Text, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import { PositionsDetailItemType } from "@/types/index";
import { mode } from "@/utils/theme";

interface Props extends PositionsDetailItemType {
  valueColor?: string;
}

const PositionsDetailItem: FC<Props> = ({ title, value, unit, valueColor }) => {
  const { colorMode } = useColorMode();

  return (
    <HStack justifyContent="space-between" width="full">
      <Text
        className="font-sans"
        color={mode(colorMode, "primary.700.dark", "primary.700")}
      >
        {title}
      </Text>
      <HStack>
        {unit && (
          <Text
            fontSize="16px"
            lineHeight="24px"
            color={mode(colorMode, "secondary.400.dark", "secondary.400")}
            className="font-semibold"
          >
            {unit}
          </Text>
        )}
        <Text
          fontSize="16px"
          className="font-medium"
          lineHeight="24px"
          color={
            valueColor
              ? valueColor
              : mode(colorMode, "primary.main.dark", "primary.main")
          }
        >
          {value}
        </Text>
      </HStack>
    </HStack>
  );
};

export default PositionsDetailItem;
