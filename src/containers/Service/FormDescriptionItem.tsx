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
          fontSize={"sm"}
          color={mode(colorMode, "primary.200.dark", "primary.800.dark")}
        >
          {leftPart}
        </Text>
        <Text>
          <span>{rightPart}</span>{" "}
          <span style={{ fontSize: "14px" }}>{extension}</span>
        </Text>
      </div>
    </>
  );
};

export default FormDescriptionItem;
