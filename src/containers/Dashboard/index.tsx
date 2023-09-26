import { useState } from "react";

import Header from "@/containers/Dashboard/Header";
import Table from "@/containers/Dashboard/Table";
import { viewTypes } from "@/types";

export type ColumnsActive =
  | "Tokens"
  | "Service"
  | "PNL"
  | "Margin"
  | "Amount"
  | "Status"
  | "";
export type ColumnsOther = "Tokens" | "Service" | "Date";

const columnsActive: ColumnsActive[] = [
  "Tokens",
  "Service",
  "PNL",
  "Amount",
  "Status",
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
