import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import Header from "@/components/dashboard/Header";
import PageWrapper from "@/components/page-wrapper";
import { viewTypes } from "@/types";

const DashboardPage = () => {
  const [activeView, setActiveView] = useState<viewTypes>("Active");

  return (
    <PageWrapper>
      <Header currentView={activeView} setActiveView={setActiveView} />
    </PageWrapper>
  );
};

export default DashboardPage;
