import { GridItem, useColorMode } from "@chakra-ui/react";

import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

const PositionsDetails = () => {
  const { colorMode } = useColorMode();

  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      bg={pickColor(colorMode, palette.colors.primary, "100")}
    >
      Positions Details
    </GridItem>
  );
};

export default PositionsDetails;
