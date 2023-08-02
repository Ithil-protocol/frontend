import { Td, Tr } from "@chakra-ui/react";
import { FC } from "react";

import { Loading } from "@/components/loading";
import { useColorMode } from "@/hooks/useColorMode";
import { palette } from "@/styles/theme/palette";

interface Props {
  tdCount: number;
}

const TRowLoading: FC<Props> = ({ tdCount }) => {
  const { pickColor } = useColorMode();

  return (
    <Tr
      width="72"
      bgColor={pickColor(palette.colors.primary, "100")}
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
