import { Box, SkeletonText, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { formatUnits } from "viem";

import { useColorMode } from "@/hooks/useColorMode";
import { useVaultDetails } from "@/hooks/useVaultDetails";
import { VaultName } from "@/types";
import { fixPrecision, getAssetByName, getSingleQueryParam } from "@/utils";

const Content = () => {
  const {
    query: { token },
  } = useRouter();
  const { mode } = useColorMode();

  const normalizedToken = getSingleQueryParam(token);

  const { data, isLoading } = useVaultDetails(
    normalizedToken.toUpperCase() as VaultName
  );

  const asset = getAssetByName(normalizedToken);

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
            +formatUnits(data.freeLiquidity ?? 0n, asset?.decimals ?? 0),
            2
          )} ${asset?.name}`,
        },
        {
          title: "Loaned out",
          value: `${fixPrecision(
            +formatUnits(data.netLoans ?? 0n, asset?.decimals ?? 0),
            2
          )}  ${asset?.name}`,
        },
        {
          title: "Current Profits",
          value: `${
            !!data.currentProfits && !!data.currentLosses
              ? data.currentProfits - data.currentLosses
              : 0n
          } ${asset?.name}`,
        },
        {
          title: "Share price",
          value: fixPrecision(
            +formatUnits(data?.convertToShares ?? 0n, asset?.decimals ?? 0),
            2
          ),
        },
      ].map((item, index) => {
        return (
          <Box
            key={item.title + index}
            bg={mode("primary.100", "primary.100.dark")}
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
