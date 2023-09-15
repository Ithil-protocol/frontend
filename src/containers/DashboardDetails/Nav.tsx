import { Grid, GridItem } from "@chakra-ui/react";

import ClosePosition from "@/components/ClosePosition";
import PositionsDetails from "@/components/PositionsDetails";

const Nav = () => {
  return (
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
        <PositionsDetails
          collateral=""
          currentPrice=""
          distanceFromLiquid=""
          liquidPrice=""
          loan=""
          openPrice=""
          opened=""
          profit=""
        />
        <ClosePosition asset="" positionValue="" />
      </Grid>
    </GridItem>
  );
};

export default Nav;
