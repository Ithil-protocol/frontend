import { Box, SkeletonText, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { formatUnits } from "viem";

import { useVaultDetails } from "@/hooks/useVaultDetails";
import { VaultName } from "@/types";
import { fixPrecision, getVaultByTokenName } from "@/utils";
import { mode } from "@/utils/theme";

const Content = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const token = (router.query.token || "") as string;

  const { data, isLoading } = useVaultDetails(token.toUpperCase() as VaultName);

  const vault = getVaultByTokenName(token as VaultName);

  console.log("vaultvault", vault);

  return (
    <Box
      width={{
        md: "100%",
        lg: "20%",
      }}
      className="flex flex-col flex-1 w-full lg:flex-[0.4] h-full "
      gap="10px"
    >
      {[
        {
          title: "Borrowable Balance",
          value: `${fixPrecision(
            +formatUnits(data.freeLiquidity ?? 0n, vault?.decimals ?? 0),
            2
          )} ${vault?.name}`,
        },
        {
          title: "Loaned out",
          value: `${fixPrecision(
            +formatUnits(data.netLoans ?? 0n, vault?.decimals ?? 0),
            2
          )}  ${vault?.name}`,
        },
        {
          title: "Current Profits",
          value: `${
            !!data.currentProfits && !!data.currentLosses
              ? data.currentProfits - data.currentLosses
              : 0n
          } ${vault?.name}`,
        },
        {
          title: "Share price",
          value: fixPrecision(
            +formatUnits(data?.convertToShares ?? 0n, vault?.decimals ?? 0),
            2
          ),
        },
      ].map((item, index) => {
        return (
          <Box
            key={item.title + index}
            bg={mode(colorMode, "primary.100", "primary.100.dark")}
            style={{
              alignItems: "center",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "30px 10px",
              width: "100%",
              height: "100%",
            }}
          >
            <Text textAlign="center" fontWeight="bold">
              {item.title}
            </Text>
            {isLoading ? (
              <SkeletonText width={30} noOfLines={1} mt={10} />
            ) : (
              <Text mt="20px" textAlign="center" fontWeight="medium">
                {item.value?.toString()}
              </Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Content;
