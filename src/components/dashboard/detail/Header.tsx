import { GridItem, useColorMode } from "@chakra-ui/react";

import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

const Header = () => {
  const { colorMode } = useColorMode();
  return (
    <GridItem
      bg={pickColor(colorMode, palette.colors.primary, "100")}
      area="header"
      borderRadius={"12px"}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "17px",
        md: "27px",
      }}
    >
      Header
    </GridItem>
  );
};

export default Header;
