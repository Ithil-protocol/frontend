import { Text, Tooltip } from "@chakra-ui/react";
import { FC } from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const ToolTip: FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active) {
    const value = payload?.[0].value?.toString().split(".") || "";
    return (
      <Tooltip>
        <Text>{`${value[0]}.${value[1].slice(0, 6)}`}</Text>
      </Tooltip>
    );
  }
  return null;
};

export default ToolTip;
