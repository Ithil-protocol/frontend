import { Text, useColorMode } from "@chakra-ui/react";

import { mode } from "@/utils/theme";

interface Props {
  leftPart: string;
  rightPart: string;
  extension: string;
}

const FormDescriptionItem: React.FC<Props> = ({
  extension,
  leftPart,
  rightPart,
}) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 5px 5px 15px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "24px",
          }}
          color={mode(colorMode, "primary.200.dark", "primary.700.dark")}
        >
          {leftPart}
        </Text>
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          <span>{rightPart}</span>
          <span>{extension}</span>
        </Text>
      </div>
    </>
  );
};

export default FormDescriptionItem;
