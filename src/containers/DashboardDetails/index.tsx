import { Grid } from "@chakra-ui/react";

import PageWrapper from "@/components/page-wrapper";
import Chart from "@/containers/DashboardDetails/Chart";

import Header from "./Header";
import Nav from "./Nav";

const DashboardDetailPage = () => {
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
        <Header />
        <Nav />
        <Chart />
      </Grid>
    </PageWrapper>
  );
};

export default DashboardDetailPage;
