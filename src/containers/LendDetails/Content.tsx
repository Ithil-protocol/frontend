import { Box, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";

import { mode } from "@/utils/theme";

const Content = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const token = (router.query.token || "") as string;

  return (
    <Box className="flex-1 w-full lg:flex-[0.4] h-full">
      {[
        {
          title: "Borrowable Balance",
          value: `0 ${token}`,
        },
        {
          title: "Utilisation Rate",
          value: "0.00%",
        },
        {
          title: "Revenues",
          value: `0 ${token}`,
        },
        {
          title: "Insurance Reserve",
          value: `0 ${token}`,
        },
      ].map((item, index) => {
        return (
          <Box
            key={item.title + index}
            mt={5}
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
            <Text mt="20px" fontWeight="medium">
              {item.value}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default Content;
