import { Box, HStack, Text, VStack, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

import { CloseButton } from "@/assets/svgs";
import { routes, socialMedia } from "@/utils";

const Sidebar = () => {
  const { colorMode } = useColorMode();
  return (
    <div className="absolute top-0 w-full h-screen -translate-y-5 bg-[#070B0F] z-[9999999]">
      <HStack justifyContent="end" className="px-8 py-8">
        <CloseButton className="w-4 h-4" />
      </HStack>
      <VStack
        alignItems="start"
        direction="column"
        justifyContent="space-between"
        className="mx-8 my-4 h-[85%]"
      >
        <VStack spacing={15} alignItems="start">
          {routes.map((route, index) => (
            <Link href={route.url} key={route.url + index}>
              <Text fontSize="18px">{route.name}</Text>
            </Link>
          ))}
        </VStack>
        <Box className="flex flex-col w-full gap-3 sm:flex-row md:flex-row">
          {socialMedia.map((item, index) => (
            <Link
              className="flex items-center justify-between w-full gap-5 pr-3 rounded-sm sm:justify-start hover:bg-primary-100"
              key={item.link + index}
              href={item.link}
              target="_blank"
            >
              <span style={{ padding: "5px" }}>
                <item.Icon width={24} height={24} />
              </span>
              <span>{item.title}</span>
            </Link>
          ))}
        </Box>
      </VStack>
    </div>
  );
};

export default Sidebar;
