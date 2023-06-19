import { Box, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import Chart from "@/components/chart";
import fakeChartData from "@/data/fakeData.json";
import { formatDate } from "@/utils/date.utils";
import { mode } from "@/utils/theme";

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
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [graphSection] = useState<graphSections>("APY");

  const token = router.query.token as string;

  return (
    <>
      <div style={{ padding: "80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span
            onClick={() => router.push("/lend")}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft width={32} height={32} />
          </span>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span>
              <TokenIcon name={token} width={38} height={38} />
            </span>
            <Text fontWeight="light" fontSize="3xl">
              {token} Vault Details
            </Text>
          </div>
          <span></span>
        </div>

        <div
          style={{
            marginTop: "100px",
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "20%",
            }}
          >
            {[
              {
                title: "Borrowable Balance",
                value: `0 ${token}`,
              },
              { title: "Utilisation Rate", value: "0.00%" },
              {
                title: "Revenues",
                value: `0 ${token}`,
              },
              {
                title: "Insurance Reserve",
                value: `0 ${token}`,
              },
            ].map((item) => {
              return (
                <>
                  <Box
                    bg={mode(colorMode, "primary.100", "primary.100.dark")}
                    style={{
                      alignItems: "center",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "30px 10px",
                      width: "100%",
                    }}
                  >
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text mt={"20px"} fontWeight="medium">
                      {item.value}
                    </Text>
                  </Box>
                </>
              );
            })}
          </div>
          <div
            style={{ width: "80%" }}
            className="p-5 rounded-xl bg-primary-100"
          >
            <div style={{ height: "100%" }} className="pt-4 h-96">
              <Chart
                data={graphData}
                xKey="date"
                yKey={graphSection === "APY" ? "apy" : "tvl"}
                dataKey={graphSection === "APY" ? "apy" : "tvl"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
