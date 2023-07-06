import { Grid } from "@chakra-ui/react";

import Chart from "@/containers/DashboardDetails/Chart";

import Header from "./Header";
import Nav from "./Nav";

const DashboardDetailPage = () => {
  return (
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
      <Header />
      <Nav />
      <Chart />
    </Grid>
  );
};

export default DashboardDetailPage;
