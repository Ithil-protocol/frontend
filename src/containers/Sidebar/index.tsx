import { Box, HStack, Text, VStack, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

import { CloseButton } from "@/assets/svgs";
import { routes, socialMedia } from "@/utils";
import { mode } from "@/utils/theme";

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const closeSidebar = () => {};
  return (
    <Box
      className={` top-0 w-full h-[104vh] bottom-0 right-0 left-0 fixed -translate-y-5  z-[9999999]`}
      backgroundColor={mode(colorMode, "#ffffff", "#070b0f")}
    >
      <HStack justifyContent="end" className="p-14">
        <span onClick={closeSidebar}>
          {" "}
          <CloseButton className="w-4 h-4" />
        </span>
      </HStack>
      <VStack
        alignItems="start"
        direction="column"
        className="mx-8 my-4 h-[85%]"
      >
        <VStack spacing={15} alignItems="start" marginBottom={20}>
          {routes.map((route, index) => (
            <Link href={route.url} key={route.url + index}>
              <Text fontSize="18px">{route.name}</Text>
            </Link>
          ))}
        </VStack>
        <Box className="flex flex-row justify-center w-full gap-3">
          {socialMedia.map((item, index) => (
            <Link
              className="flex items-center gap-5 rounded-full hover:bg-primary-100"
              key={item.link + index}
              href={item.link}
              target="_blank"
            >
              <span style={{ padding: "5px" }}>
                <item.Icon width={24} height={24} />
              </span>
            </Link>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
