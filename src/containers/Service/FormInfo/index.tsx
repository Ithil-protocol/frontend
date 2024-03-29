import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

import FormInfoItem, { Props as FormInfoProps } from "./FormInfoItem";

interface Props {
  items: FormInfoProps[];
}

const FormInfo: FC<Props> = ({ items }) => {
  const { mode, pickColor } = useColorMode();

  return (
    <Box
      marginTop={5}
      bg={mode("primary.100", "primary.100.dark")}
      borderRadius="5px"
      border={`2px dashed ${pickColor(palette.colors.primary, "400")}`}
    >
      {items.map((item) => (
        <FormInfoItem key={item.label} {...item} />
      ))}
    </Box>
  );
};

export default FormInfo;
