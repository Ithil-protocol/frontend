import { Box } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/containers/Sidebar";
import { body, heading as headingTypo } from "@/utils/fonts";

interface Props {
  children?: ReactNode;
}

const PageWrapper = ({ children }: Props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box width="100%" height="100%">
      <Sidebar
        onSetSidebarOpen={setSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <Navbar onSetSidebarOpen={setSidebarOpen} />
      <Box
        className={`container p-5 mx-auto font-sans flex flex-col gap-7 items-center w-full ${body.variable} ${headingTypo.variable}`}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;
