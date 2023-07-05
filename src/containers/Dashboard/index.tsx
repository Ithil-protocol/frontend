import { useState } from "react";

import PageWrapper from "@/components/page-wrapper";
import Header from "@/containers/Dashboard/Header";
import Table from "@/containers/Dashboard/Table";
import { viewTypes } from "@/types";

export type ColumnsActive = "Tokens" | "Service" | "PnL" | "";
export type ColumnsOther = "Token pair" | "Position" | "Date";

const columnsActive: ColumnsActive[] = ["Tokens", "Service", "PnL", ""];
const columnsOther: ColumnsOther[] = ["Token pair", "Position", "Date"];
const DashboardPage = () => {
  const [activeView, setActiveView] = useState<viewTypes>("Active");

  return (
    <PageWrapper>
      <Header currentView={activeView} setActiveView={setActiveView} />
      <Table
        columns={activeView === "Active" ? columnsActive : columnsOther}
        activeView={activeView}
      />
    </PageWrapper>
  );
};

export default DashboardPage;
