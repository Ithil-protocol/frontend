import { Grid, GridItem, useColorMode } from "@chakra-ui/react";

import PageWrapper from "@/components/page-wrapper";
import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

const DashboardDetailPage = () => {
  const { colorMode } = useColorMode();
  return (
    <PageWrapper>
      <Grid
        templateAreas={`"header header"
                      "nav main"
                     `}
        templateRows="1fr auto"
        templateColumns="1fr 1fr"
        gap={["24px"]}
        height="full"
        width="full"
      >
        <GridItem
          bg={pickColor(colorMode, palette.colors.primary, "100")}
          area="header"
          borderRadius={["12px"]}
          paddingX={["40px"]}
          paddingY={["27px"]}
        >
          Header
        </GridItem>
        <GridItem area="nav">
          <Grid gap={["24px"]} height="full" width="full">
            <GridItem
              borderRadius={["12px"]}
              paddingX={["40px"]}
              paddingY={["40px"]}
              bg={pickColor(colorMode, palette.colors.primary, "100")}
            >
              Positions Details
            </GridItem>
            <GridItem
              borderRadius={["12px"]}
              paddingX={["40px"]}
              paddingY={["40px"]}
              bg={pickColor(colorMode, palette.colors.primary, "100")}
            >
              Close Position
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem
          borderRadius={["12px"]}
          paddingX={["40px"]}
          paddingY={["40px"]}
          bg={pickColor(colorMode, palette.colors.primary, "100")}
          area="main"
        >
          Main
        </GridItem>
      </Grid>
    </PageWrapper>
  );
};

export default DashboardDetailPage;
