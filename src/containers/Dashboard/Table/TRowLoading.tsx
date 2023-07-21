import { Td, Tr, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import { Loading } from "@/components/loading";
import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

interface Props {
  tdCount: number;
}

const TRowLoading: FC<Props> = ({ tdCount }) => {
  const { colorMode } = useColorMode();

  return (
    <Tr
      width="72"
      bgColor={pickColor(colorMode, palette.colors.primary, "100")}
      borderRadius="12px"
      sx={{
        "& > td": {
          padding: ["20px 40px", "30px 40px"],
        },
        minWidth: "400px",
        minHeight: "200px",
      }}
    >
      {Array.from({ length: tdCount }).map((_, index) => (
        <Td key={index} textAlign="end" width={800} height="108px">
          <Loading />
        </Td>
      ))}
    </Tr>
  );
};

export default TRowLoading;
