import { Grid, GridItem } from "@chakra-ui/react";

import ClosePosition from "./ClosePosition";
import PositionsDetails from "./PositionsDetails";

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
        <PositionsDetails />
        <ClosePosition />
      </Grid>
    </GridItem>
  );
};

export default Nav;
