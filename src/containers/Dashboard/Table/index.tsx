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
import { FC, useEffect } from "react";
import { formatUnits } from "viem";

import { useClosePositions } from "@/hooks/useClosePositions";
import { useNotificationDialog } from "@/hooks/useNotificationDialog";
import {
  useAaveOpenPositions,
  useGmxOpenPositions,
} from "@/hooks/useOpenPositions";
import { viewTypes } from "@/types";
import { fixPrecision, getVaultByTokenAddress } from "@/utils";
import { mode } from "@/utils/theme";

import ActiveTRow from "./ActiveTRow";
import CloseTRow from "./CloseTRow";

interface Props {
  columns: any[];
  activeView: viewTypes;
}

const Table: FC<Props> = ({ columns, activeView }) => {
  const notificationDialog = useNotificationDialog();
  const { colorMode } = useColorMode();
  const { positions: aavePositions, isLoading: isLoadingAave } =
    useAaveOpenPositions();
  const { positions: gmxPositions, isLoading: isLoadingGmx } =
    useGmxOpenPositions();

  const positions = [aavePositions, gmxPositions].flat().sort((a, b) => {
    return (
      new Date(Number(b.agreement?.createdAt)).getTime() -
      new Date(Number(a.agreement?.createdAt)).getTime()
    );
  });

  const { positions: closedPositions, isLoading: isLoadingClosed } =
    useClosePositions();
  const isPositionsExist = positions.length === 0 && positions;
  const isClosedExist = closedPositions.length === 0 && closedPositions;
  const hasItems =
    activeView === "Active" ? positions.length > 0 : closedPositions.length > 0;

  useEffect(() => {
    if (isLoadingAave || isLoadingGmx) {
      notificationDialog.openDialog({
        status: "loading",
        title: "Loading positions",
        duration: 0,
      });
    } else {
      notificationDialog.closeDialog();
    }
  }, [isLoadingAave, isLoadingGmx]);

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
          {activeView === "Active"
            ? positions.map((item, key) =>
                item.agreement?.loans.map((loanItem) => {
                  const vault = getVaultByTokenAddress(loanItem.token);

                  return (
                    <ActiveTRow
                      key={key}
                      data={{
                        amount: loanItem.amount,
                        margin: formatUnits(loanItem.margin, vault.decimals),
                        token: loanItem.token,
                        formattedPnl: fixPrecision(+item.pnl!, 2).toString(),
                        pnl: item.pnl,
                        pnlPercentage: fixPrecision(
                          +item.pnlPercentage!,
                          2
                        ).toString(),
                        id: item.id,
                        quote: item.quote,
                        type: item.type,
                      }}
                    />
                  );
                })
              )
            : activeView === "Closed" &&
              closedPositions.map((item, key) =>
                item.agreement?.loans.map((loanItem) => {
                  return (
                    <CloseTRow
                      key={key}
                      data={{
                        amount: loanItem.amount,
                        createdAt: item.agreement?.createdAt,
                        margin: fixPrecision(Number(loanItem.margin), 2),
                        token: loanItem.token,
                        type: item.type,
                      }}
                    />
                  );
                })
              )}
          {isPositionsExist && activeView === "Active" && (
            <Tr className="flex items-center justify-center text-lg font-bold h-96 text-primary-900">
              <Td>You don&apos;t have any recorded open positions.</Td>
            </Tr>
          )}
          {isClosedExist && activeView === "Closed" && (
            <Tr className="flex items-center justify-center text-lg font-bold h-96 text-primary-900">
              <Td>You don&apos;t have any recorded closed positions.</Td>
            </Tr>
          )}
        </Tbody>
      </DefaultTable>
    </TableContainer>
  );
};

export default Table;
