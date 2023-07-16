import { Box, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import { palette } from "@/styles/theme/palette";
import { mode, pickColor } from "@/utils/theme";

import FormInfoItem, { Props as FormInfoProps } from "./FormInfoItem";

interface Props {
  items: FormInfoProps[];
}

const FormInfo: FC<Props> = ({ items }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      marginTop={5}
      bg={mode(colorMode, "primary.100", "primary.100.dark")}
      borderRadius="5px"
      border={`2px dashed ${pickColor(
        colorMode,
        palette.colors.primary,
        "400"
      )}`}
    >
      {items.map((item) => (
        <FormInfoItem key={item.label} {...item} />
      ))}
    </Box>
  );
};

export default FormInfo;
