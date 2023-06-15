import { useState } from "react";

import Header from "@/components/dashboard/Header";
import Table from "@/components/dashboard/Table";
import PageWrapper from "@/components/page-wrapper";
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
