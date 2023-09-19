import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import { assetsObjByName } from "@/data/assets";
import fakeChartData from "@/data/fakeData.json";
import { AssetName } from "@/types";
import { getSingleQueryParam } from "@/utils";
import { formatDate } from "@/utils/date.utils";

import Chart from "./Chart";
import Content from "./Content";

interface GraphDataPoint {
  date: string;
  tvl: number | string;
  apy: number | string;
}
type GraphSection = "TVL" | "APY";

const graphData = fakeChartData.data.map<GraphDataPoint>((item) => ({
  date: formatDate(new Date(item.timestamp)),
  tvl: item.tvlUsd,
  apy: item.apy,
}));

export default function LendDetails() {
  const [graphSection] = useState<GraphSection>("APY");
  const router = useRouter();
  const token = getSingleQueryParam(router.query.token);
  const assetToken = assetsObjByName[token.toUpperCase() as AssetName];

  return (
    <Box width="full">
      <HStack
        style={{
          marginTop: "20px",
        }}
        justifyContent="space-between"
        width="full"
      >
        <Link href="/lend" style={{ cursor: "pointer" }}>
          <ArrowLeft width={32} height={32} />
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>
            <TokenIcon name={token} width={38} height={38} />
          </span>
          <Text fontWeight="light" fontSize="3xl">
            {assetToken?.label} Vault Details
          </Text>
        </div>
        <span></span>
      </HStack>
      <Box
        mt={{
          base: "20px",
          md: "10px",
          sm: "10px",
        }}
        display="flex"
        gap="20px"
        flexDirection={{ base: "column", lg: "row" }}
        flex={1}
      >
        <Box
          width={{
            md: "100%",
            lg: "20%",
          }}
        >
          <Content />
        </Box>

        <Chart data={graphData} graphSection={graphSection} />
      </Box>
    </Box>
  );
}
