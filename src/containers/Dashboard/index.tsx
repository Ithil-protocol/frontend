import { useState } from "react";

import PageWrapper from "@/components/page-wrapper";
import Header from "@/containers/Dashboard/Header";
import Table from "@/containers/Dashboard/Table";
import { viewTypes } from "@/types";

export type ColumnsActive = "Token pair" | "Position" | "Profit" | "";
const columnsActive: ColumnsActive[] = ["Token pair", "Position", "Profit", ""];
const DashboardPage = () => {
  const [activeView, setActiveView] = useState<viewTypes>("Active");

  return (
    <PageWrapper>
      <Header currentView={activeView} setActiveView={setActiveView} />
      <Table columns={columnsActive} />
    </PageWrapper>
  );
};

export default DashboardPage;
