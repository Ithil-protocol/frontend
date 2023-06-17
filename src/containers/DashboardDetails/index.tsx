import { Grid } from "@chakra-ui/react";

import Chart from "@/components/dashboard/detail/Chart";
import Header from "@/components/dashboard/detail/Header";
import Nav from "@/components/dashboard/detail/Nav";
import PageWrapper from "@/components/page-wrapper";

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
