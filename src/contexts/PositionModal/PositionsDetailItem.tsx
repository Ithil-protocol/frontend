import { ColorProps, HStack, Text } from "@chakra-ui/react";
import { FC } from "react";

import { useColorMode } from "@/hooks/useColorMode";
import { PositionsDetailItemType } from "@/types/index";

interface Props extends PositionsDetailItemType {
  valueColor?: ColorProps["color"];
}

const PositionsDetailItem: FC<Props> = ({
  postfix = "",
  postfixIcon,
  postfixStyle = {},
  prefix = "",
  prefixStyle = {},
  title = "",
  value = "",
  valueColor,
}) => {
  const { mode } = useColorMode();

  const fixedValue =
    typeof value === "string" || typeof value === "number" ? [value] : value;

  const fixedPostfix = typeof postfix === "string" ? [postfix] : postfix;

  const fixedPostfixIcon = !Array.isArray(postfixIcon)
    ? [postfixIcon]
    : postfixIcon;

  return (
    <HStack justifyContent="space-between" width="full">
      <Text
        className="font-sans"
        color={mode("primary.100.dark", "primary.100")}
      >
        {title}
      </Text>
      <HStack>
        <Text
          style={prefixStyle}
          fontSize="16px"
          lineHeight="24px"
          color={mode("secondary.400.dark", "secondary.400")}
          className="font-semibold"
        >
          {prefix}
        </Text>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            fixedValue.map((item, index) => (
              <Text
                key={index}
                fontSize="16px"
                className="font-medium"
                lineHeight="24px"
                color={
                  valueColor
                    ? valueColor
                    : mode("primary.main.dark", "primary.main")
                }
              >
                {item}
              </Text>
            )),
          ]}
        </div>

        <div
          style={{ display: "flex", height: "max", flexDirection: "column" }}
        >
          {fixedPostfix.map((item, index) => (
            <Text
              key={index}
              style={postfixStyle}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              fontSize="16px"
              gap="10px"
              lineHeight="24px"
              color={mode("secondary.500.dark", "secondary.500")}
              className="font-semibold"
            >
              {item}

              {fixedPostfixIcon?.[index] || ""}
            </Text>
          ))}
        </div>
      </HStack>
    </HStack>
  );
};

export default PositionsDetailItem;
