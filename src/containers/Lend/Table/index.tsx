import {
  Table as DefaultTable,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";

import { useVaults } from "@/hooks/use-vaults.hook";
import { Vaults } from "@/types";

import Deposit from "../deposit";
import TRow from "./TRow";
import Thead from "./Thead";

type Columns = "asset" | "apy" | "tvl" | "borrowed" | "deposited" | "info";

const columns: Array<{
  text: string;
  key: Columns;
  tooltip?: string;
  hideText?: boolean;
  className?: string;
}> = [
  { text: "Asset", key: "asset" },
  {
    text: "APY",
    key: "apy",
    tooltip: "Annual Percentage Yield, your ROI on the deposit",
  },
  {
    text: "TVL",
    key: "tvl",
    tooltip: "Total value locked, how many tokens have been deposited",
  },
  {
    text: "Borrowed",
    key: "borrowed",
    tooltip: "How many tokens are currently lent to risk-takers",
    // className: mobileHiddenColumnClass,
  },
  {
    text: "Deposited",
    key: "deposited",
    tooltip: "How many tokens are currently deposited",
    // className: mobileHiddenColumnClass,
  },
  { text: "", key: "info" },
];
const Table = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { data, isError, isLoading } = useVaults();

  return (
    <TableContainer className="w-full rounded-xl bg-primary-100 lg:p-6">
      <DefaultTable size="md">
        <Thead columns={columns} />
        <Tbody>
          {data?.map((vault: Vaults[number], idx) => (
            <Fragment key={idx}>
              <TRow
                isVaultsError={isError}
                isLoading={isLoading}
                vaultData={data}
                setSelectedRow={setSelectedRow}
                selectedRow={selectedRow}
                idx={idx}
                vault={vault}
              />
              {selectedRow === idx && (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Deposit token={data[idx].token} />
                  </Td>
                </Tr>
              )}
            </Fragment>
          ))}
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
