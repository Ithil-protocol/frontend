import { Box, HStack, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

const ToolTip: FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  const { colorMode } = useColorMode();
  if (active) {
    return (
      <Box
        bgColor={pickColor(colorMode, palette.colors.primary, "100")}
        padding="10px 30px"
        border={mode(colorMode, "primary.100.dark", "primary.100")}
        className="border rounded-xl border-white-100"
      >
        <HStack>
          <Text>Date:</Text>
          <Text>{`${label}`}</Text>
        </HStack>
        <HStack>
          <Text>APY:</Text>
          <Text>{`${payload?.[0].value?.toString()}`}</Text>
        </HStack>
      </Box>
    );
  }
  return null;
};

export default ToolTip;
