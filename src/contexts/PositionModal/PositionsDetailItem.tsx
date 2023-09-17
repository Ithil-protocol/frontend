import { HStack, Text } from "@chakra-ui/react";
import { FC } from "react";

import { useColorMode } from "@/hooks/useColorMode";
import { PositionsDetailItemType } from "@/types/index";

interface Props extends PositionsDetailItemType {
  valueColor?: string;
}

const PositionsDetailItem: FC<Props> = ({
  title,
  value,
  prefix,
  valueColor,
  postfix,
  postfixIcon,
}) => {
  const { mode } = useColorMode();

  return (
    <HStack justifyContent="space-between" width="full">
      <Text
        className="font-sans"
        color={mode("primary.100.dark", "primary.100")}
      >
        {title}
      </Text>
      <HStack>
        {prefix && (
          <Text
            fontSize="16px"
            lineHeight="24px"
            color={mode("secondary.400.dark", "secondary.400")}
            className="font-semibold"
          >
            {prefix}
          </Text>
        )}
        <Text
          fontSize="16px"
          className="font-medium"
          lineHeight="24px"
          color={
            valueColor ? valueColor : mode("primary.main.dark", "primary.main")
          }
        >
          {value}
        </Text>
        {postfix && (
          <Text
            display="flex"
            alignItems="center"
            fontSize="16px"
            gap="5px"
            lineHeight="24px"
            color={mode("secondary.500.dark", "secondary.500")}
            className="font-semibold"
          >
            {postfix}

            {postfixIcon}
          </Text>
        )}
      </HStack>
    </HStack>
  );
};

export default PositionsDetailItem;
