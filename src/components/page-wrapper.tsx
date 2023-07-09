import { Box, Heading } from "@chakra-ui/react";
import { type FC, useState } from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/containers/Sidebar";
import { type PropsWithClassName } from "@/types/components.types";
import { body, heading as headingTypo } from "@/utils/fonts";

interface PageWrapperProps extends PropsWithClassName {
  heading?: string;
  textAlign?: "left" | "center" | "right"; // default is 'center'
  className?: string;
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  heading,
  className,
  textAlign,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box width="100%" height="100%">
      <Sidebar
        onSetSidebarOpen={setSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />

      <Navbar onSetSidebarOpen={setSidebarOpen} />

      <Box
        className={`container p-3 sm:p-0 md:p-1 mx-auto font-sans flex flex-col gap-7 items-center w-full ${body.variable} ${headingTypo.variable} ${className}`}
      >
        {heading != null && (
          <Heading
            as="h1"
            size="h1"
            className={`mb-2 ${textAlign === "left" && "self-start"} ${
              textAlign === "right" && "self-end"
            }`}
          >
            {heading}
          </Heading>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;
