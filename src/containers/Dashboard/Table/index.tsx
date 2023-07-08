import {
  Table as DefaultTable,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";

import { useGetAgreementsByUser } from "@/hooks/useGetAgreementByUser";
import { viewTypes } from "@/types";
import { mode } from "@/utils/theme";

import TRow from "./TRow";
import TRowOther from "./TRowOther";

interface Props {
  columns: any[];
  activeView: viewTypes;
}

const Table: FC<Props> = ({ columns, activeView }) => {
  const { colorMode } = useColorMode();
  const { data } = useGetAgreementsByUser();
  console.log(data);
  return (
    <TableContainer width="full">
      <DefaultTable
        className="border-separate border-spacing-y-3"
        variant="unstyled"
        width="full"
      >
        <Thead>
          <Tr>
            {columns.map((col, index) => (
              <Th
                color={mode(colorMode, "primary.700", "primary.700.dark")}
                className="font-sans"
                fontSize="18px"
                fontWeight="medium"
                key={col + index}
              >
                {col}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {activeView === "Active" &&
            data &&
            data.map((item) =>
              item.loans.map((loanItem, key) => (
                <TRow
                  key={item.createdAt.toString() + "-" + key}
                  data={loanItem}
                />
              ))
            )}
          {activeView === "Closed" && (
            <TRowOther
              data={{
                amount: 2000n,
                createdAt: 1688477804n,
                margin: 15000000n,
                token: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
              }}
            />
          )}
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
