import { useState } from "react";

import Header from "@/containers/Dashboard/Header";
import Table from "@/containers/Dashboard/Table";
import { viewTypes } from "@/types";

export type ColumnsActive =
  | "Tokens"
  | "Service"
  | "Status"
  | "Margin"
  | "Expire"
  | "";
export type ColumnsOther = "Tokens" | "Service" | "Date";

const columnsActive: ColumnsActive[] = [
  "Tokens",
  "Service",
  "Status",
  "Margin",
  "Expire",
  "",
];
const columnsOther: ColumnsOther[] = ["Tokens", "Service", "Date"];
const DashboardPage = () => {
  const [activeView, setActiveView] = useState<viewTypes>("Active");

  return (
    <>
      <Header currentView={activeView} setActiveView={setActiveView} />
      <Table
        columns={activeView === "Active" ? columnsActive : columnsOther}
        activeView={activeView}
      />
    </>
  );
};

export default DashboardPage;
