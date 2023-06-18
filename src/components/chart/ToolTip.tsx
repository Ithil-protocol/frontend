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
    return (
      <Tooltip>
        <Text>{`${payload?.[0].value?.toString()}`}</Text>
      </Tooltip>
    );
  }
  return null;
};

export default ToolTip;
