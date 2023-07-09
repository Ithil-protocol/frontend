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

import { useClosePositions } from "@/hooks/useClosePositions";
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
  const { data: closed } = useClosePositions();
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
            data[0].map((item) =>
              item.loans.map((loanItem, key) => (
                <TRow
                  key={item.createdAt.toString() + "-" + key}
                  data={loanItem}
                />
              ))
            )}
          {activeView === "Closed" &&
            closed &&
            closed.map((item, key) =>
              item.agreement?.loans.map((loanItem) => (
                <TRowOther
                  key={key}
                  data={{
                    amount: loanItem.amount,
                    createdAt: item.agreement?.createdAt,
                    margin: loanItem.margin,
                    token: loanItem.token,
                  }}
                />
              ))
            )}
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
