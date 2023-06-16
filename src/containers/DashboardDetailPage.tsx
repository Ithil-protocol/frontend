import { Grid, GridItem, useColorMode } from "@chakra-ui/react";

import PageWrapper from "@/components/page-wrapper";
import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

const DashboardDetailPage = () => {
  const { colorMode } = useColorMode();
  return (
    <PageWrapper>
      <Grid
        templateAreas={{
          base: `"header"
          "nav"
          "main"
         `,
          md: `"header header"
         "nav main"
        `,
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr auto",
        }}
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
        }}
        gap={{
          base: "12px",
          md: "20px",
          lg: "24px",
        }}
        height="full"
        width="full"
      >
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
        <GridItem area="nav">
          <Grid
            gap={{
              base: "12px",
              md: "20px",
              lg: "24px",
            }}
            height="full"
            width="full"
          >
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
              Close Position
            </GridItem>
          </Grid>
        </GridItem>
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
          area="main"
        >
          Main
        </GridItem>
      </Grid>
    </PageWrapper>
  );
};

export default DashboardDetailPage;
