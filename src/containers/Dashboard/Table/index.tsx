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
import { useOpenPositions } from "@/hooks/useOpenPositions";
import { viewTypes } from "@/types";
import { fixPrecision } from "@/utils";
import { mode } from "@/utils/theme";

import TRow from "./TRow";
import TRowOther from "./TRowOther";

interface Props {
  columns: any[];
  activeView: viewTypes;
}

const Table: FC<Props> = ({ columns, activeView }) => {
  const { colorMode } = useColorMode();
  const { positions } = useOpenPositions();
  const { data: closed } = useClosePositions();

  return (
    <TableContainer width="full">
      <DefaultTable
        className="border-separate border-spacing-y-3"
        variant="unstyled"
        width="full"
      >
        <Thead>
          <Tr width="48">
            {columns.map((col, index) => (
              <Th
                width="48"
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
            positions &&
            positions.map((item, key) =>
              item.agreement?.loans.map((loanItem) => (
                <TRow
                  key={key}
                  data={{
                    amount: loanItem.amount,
                    margin: loanItem.margin,
                    token: loanItem.token,
                    pnl: fixPrecision(+item.pnl!, 2).toString(),
                    pnlPercentage: fixPrecision(
                      +item.pnlPercentage!,
                      2
                    ).toString(),
                    id: item.id,
                    quote: item.quote,
                  }}
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
