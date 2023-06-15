import {
  Box,
  Button,
  ButtonGroup,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import PageWrapper from "@/components/page-wrapper";

type viewType = "Active" | "Closed" | "Liquidated";

const DashboardPage = () => {
  const [activeView, setActiveView] = useState<viewType>("Active");

  const handleActiveView = (view: viewType) => {
    setActiveView(view);
  };

  return (
    <PageWrapper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="full"
        marginTop="135"
      >
        <Box display="flex" alignItems="center" gap="15">
          <Link className="relative !bg-black-100" href="/">
            <ArrowLeft />
          </Link>
          <Text fontWeight="bold" fontSize="24px">
            Open Positions
          </Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="71px"
          bg="primary.main.100"
        >
          <Text
            className="font-sans"
            size="22px"
            fontWeight="bold"
            lineHeight="24px"
          >
            View
          </Text>
          <ButtonGroup>
            <Button
              onClick={() => handleActiveView("Active")}
              variant={activeView === "Active" ? "solid" : "ghost"}
            >
              Active
            </Button>
            <Button
              onClick={() => handleActiveView("Closed")}
              variant={activeView === "Closed" ? "solid" : "ghost"}
            >
              Closed
            </Button>
            <Button
              onClick={() => handleActiveView("Liquidated")}
              variant={activeView === "Liquidated" ? "solid" : "ghost"}
            >
              Liquidated
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default DashboardPage;
