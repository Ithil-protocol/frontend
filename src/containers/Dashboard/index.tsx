import { useState } from "react";

import PageWrapper from "@/components/page-wrapper";
import Header from "@/containers/Dashboard/Header";
import Table from "@/containers/Dashboard/Table";
import { viewTypes } from "@/types";

export type ColumnsActive = "Token pair" | "Position" | "Profit" | "";
export type ColumnsOther = "Token pair" | "Position" | "Date";

const columnsActive: ColumnsActive[] = ["Token pair", "Position", "Profit", ""];
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
