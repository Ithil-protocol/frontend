type Column = "asset" | "apy" | "tvl" | "borrowed" | "deposited" | "info";

const tableColumns: Array<{
  className?: string;
  hideText?: boolean;
  key: Column;
  text: string;
  tooltip?: string;
}> = [
  {
    key: "asset",
    text: "Asset",
  },
  {
    key: "apy",
    text: "APY",
    tooltip: "Annual Percentage Yield, your ROI on the deposit",
  },
  {
    key: "tvl",
    text: "TVL",
    tooltip: "Total value locked, how many tokens have been deposited",
  },
  {
    className: "hidden md:table-cell",
    key: "borrowed",
    text: "Borrowed",
    tooltip: "How many tokens are currently lent to risk-takers",
  },
  {
    className: "hidden md:table-cell",
    key: "deposited",
    text: "Deposited",
    tooltip: "How many tokens are currently deposited",
  },
  {
    key: "info",
    text: "",
  },
];

export const lendContent = {
  tableColumns,
  pageTitle: "Ithil - Lending",
  metaDescription: "Official frontend for Ithil strategies",
  pageWrapperHeading: "Lend",
};
