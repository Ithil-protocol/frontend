import { Box, SkeletonText, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useVaultDetails } from "@/hooks/useVaultDetails";
import { VaultName } from "@/types";
import { mode } from "@/utils/theme";

const Content = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const token = (router.query.token || "") as string;

  const { data } = useVaultDetails(token.toUpperCase() as VaultName);

  console.log(data);

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
          value: `${data.netLoans} ${token}`,
        },
        {
          title: "Utilisation Rate",
          value: `${data.latestRepay}%`,
        },
        {
          title: "Revenues",
          value: `${data.currentProfits} ${token}`,
        },
        {
          title: "Insurance Reserve",
          value: `${data.currentLosses} ${token}`,
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
            {data?.netLoans === undefined ? (
              <SkeletonText width={30} noOfLines={1} mt={10} />
            ) : (
              <Text mt="20px" textAlign="center" fontWeight="medium">
                {item.value}
              </Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Content;
