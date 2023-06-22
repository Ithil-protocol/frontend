import { Box, HStack, Text, useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { palette } from "@/styles/theme/palette";
import { formatDate } from "@/utils/date.utils";
import { mode, pickColor } from "@/utils/theme";

const ToolTip: FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  const { colorMode } = useColorMode();

  console.log("payload", payload);

  if (active) {
    return (
      <Box
        bgColor={pickColor(colorMode, palette.colors.primary, "100")}
        padding="10px 30px"
        border={mode(colorMode, "primary.100.dark", "primary.100")}
        className="border rounded-xl border-white-100"
      >
        <HStack>
          <Text>date:</Text>
          <Text>{formatDate(new Date(label))}</Text>
        </HStack>
        <HStack>
          <Text>{payload?.[0]?.name}:</Text>
          <Text>{`${payload?.[0].value?.toString()}`}</Text>
        </HStack>
      </Box>
    );
  }
  return null;
};

export default ToolTip;
