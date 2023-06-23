import {
  Box,
  Grid,
  GridItem,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import PageWrapper from "@/components/page-wrapper";
import fakeChartData from "@/data/fakeData.json";
import { formatDate } from "@/utils/date.utils";
import { mode } from "@/utils/theme";

import Chart from "./Chart";
import Content from "./Content";

interface GraphDataPoint {
  date: string;
  tvl: number | string;
  apy: number | string;
}
type graphSections = "TVL" | "APY";

const graphData = fakeChartData.data.map<GraphDataPoint>((item) => ({
  date: formatDate(new Date(item.timestamp)),
  tvl: item.tvlUsd,
  apy: item.apy,
}));

export default function LendDetails() {
  const { colorMode } = useColorMode();
  const [graphSection] = useState<graphSections>("APY");
  const router = useRouter();
  const token = (router.query.token || "") as string;

  return (
    <>
      <PageWrapper>
        {/* <Grid
          gridTemplateColumns={"20% 1fr"}
          templateAreas={{
            base: `"header header"
                    "sideLeft sideRight"`,
            md: `"header header"
                    "sideLeft sideRight"`,
            sm: `"header header " 
                    "sideLeft"
                    "sideRight"`,
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
            area="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Link href="/lend" style={{ cursor: "pointer" }}>
              <ArrowLeft width={32} height={32} />
            </Link>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span>
                <TokenIcon name={token} width={38} height={38} />
              </span>
              <Text fontWeight="light" fontSize="3xl">
                {token.toUpperCase()} Vault Details
              </Text>
            </div>
            <span></span>
          </GridItem>

          <GridItem>
            <Content />
            <Chart data={graphData} graphSection={graphSection} />
          </GridItem>
        </Grid> */}
        <Box
          width="full"
          style={{
            marginTop: "20px",
          }}
        >
          <HStack justifyContent="space-between" width="full">
            <Link href="/lend" style={{ cursor: "pointer" }}>
              <ArrowLeft width={32} height={32} />
            </Link>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span>
                <TokenIcon name={token} width={38} height={38} />
              </span>
              <Text fontWeight="light" fontSize="3xl">
                {token.toUpperCase()} Vault Details
              </Text>
            </div>
            <span></span>
          </HStack>
          <Box
            display="flex"
            gap="20px"
            flexDirection={{ base: "column", lg: "row" }}
            flex={1}
          >
            <Content />
            <Chart data={graphData} graphSection={graphSection} />
          </Box>
        </Box>
      </PageWrapper>
    </>
  );
}
