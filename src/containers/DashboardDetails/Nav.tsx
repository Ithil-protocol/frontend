import { Grid, GridItem } from "@chakra-ui/react";

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
      ></Grid>
    </GridItem>
  );
};

export default Nav;
