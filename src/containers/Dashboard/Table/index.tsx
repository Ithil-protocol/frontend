import {
  Table as DefaultTable,
  TableContainer,
  Tbody,
  Td,
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
  const hasItems =
    activeView === "Active"
      ? positions && positions.length > 0
      : closed && closed.length > 0;

  return (
    <TableContainer width="full">
      <DefaultTable
        className="border-separate border-spacing-y-3"
        variant="unstyled"
        width="full"
      >
        <Thead>
          <Tr width="56">
            {hasItems &&
              columns.map((col, index) => (
                <Th
                  width="72"
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
          {activeView === "Active" && positions && positions.length > 0 ? (
            positions.map((item, key) =>
              item.agreement?.loans.map((loanItem) => (
                <TRow
                  key={key}
                  data={{
                    amount: loanItem.amount,
                    margin: fixPrecision(Number(loanItem.margin), 2),
                    token: loanItem.token,
                    formattedPnl: fixPrecision(+item.pnl!, 2).toString(),
                    pnl: item.pnl,
                    pnlPercentage: fixPrecision(
                      +item.pnlPercentage!,
                      2
                    ).toString(),
                    id: item.id,
                    quote: item.quote,
                  }}
                />
              ))
            )
          ) : activeView === "Closed" && closed && closed.length > 0 ? (
            closed.map((item, key) =>
              item.agreement?.loans.map((loanItem) => (
                <TRowOther
                  key={key}
                  data={{
                    amount: loanItem.amount,
                    createdAt: item.agreement?.createdAt,
                    margin: fixPrecision(Number(loanItem.margin), 2),
                    token: loanItem.token,
                  }}
                />
              ))
            )
          ) : (
            <Tr className="flex items-center justify-center text-lg font-bold h-96 text-primary-900">
              <Td>
                {activeView === "Active"
                  ? "You don't have any recorded open positions."
                  : "You don't have any recorded closed positions."}
              </Td>
            </Tr>
          )}
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
