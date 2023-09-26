import {
  Table as DefaultTable,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FC } from "react";
import { formatUnits } from "viem";

import { useClosePositions } from "@/hooks/useClosePositions";
import { useColorMode } from "@/hooks/useColorMode";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  useAaveOpenPositions,
  useCallOptionOpenPositions,
  useFixedYieldOpenPositions,
  useGmxOpenPositions,
} from "@/hooks/useOpenPositions";
import { viewTypes } from "@/types";
import { fixPrecision, getAssetByAddress } from "@/utils";

import ActiveTRow from "./ActiveTRow";
import CloseTRow from "./CloseTRow";
import TRowLoading from "./TRowLoading";

interface Props {
  columns: any[];
  activeView: viewTypes;
}

const Table: FC<Props> = ({ columns, activeView }) => {
  const { mode } = useColorMode();
  const { positions: aavePositions, isLoading: isLoadingAave } =
    useAaveOpenPositions();
  const { positions: gmxPositions, isLoading: isLoadingGmx } =
    useGmxOpenPositions();
  const { positions: fixedYieldPositions, isLoading: isLoadingFixedYield } =
    useFixedYieldOpenPositions();
  const { positions: CallOptionsPositions, isLoading: isLoadingCallOption } =
    useCallOptionOpenPositions();
  const positions = [
    aavePositions,
    gmxPositions,
    fixedYieldPositions,
    CallOptionsPositions,
  ]
    .flat()
    .sort((a, b) => {
      return (
        new Date(Number(b.agreement?.createdAt)).getTime() -
        new Date(Number(a.agreement?.createdAt)).getTime()
      );
    });

  const isMounted = useIsMounted();

  const { positions: closedPositions, isLoading: isLoadingClosed } =
    useClosePositions();
  const isPositionsExist = positions.length === 0 && positions;
  const isClosedExist = closedPositions.length === 0 && closedPositions;
  const hasItems = {
    Active:
      positions.length > 0 ||
      isLoadingAave ||
      isLoadingGmx ||
      isLoadingFixedYield,
    Closed: closedPositions.length > 0 || isLoadingClosed,
  };

  const isLoadingPositions =
    isLoadingAave || isLoadingGmx || isLoadingFixedYield || isLoadingCallOption;

  if (!isMounted) return null;
  return (
    <TableContainer width="full">
      <DefaultTable
        className="border-separate border-spacing-y-3"
        variant="unstyled"
        width="full"
      >
        <Thead>
          <Tr width="56">
            {hasItems["Active"] &&
              columns.map((col, index) => (
                <Th
                  width="72"
                  color={mode("primary.700", "primary.700.dark")}
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
          {!isLoadingPositions && activeView === "Active"
            ? positions.map((item, key) =>
                item.agreement?.loans.map((loanItem) => {
                  const asset = getAssetByAddress(loanItem.token);
                  if (!asset) return null;
                  const isDebitService =
                    item.type === "aave" || item.type === "gmx";
                  return (
                    <ActiveTRow
                      key={key}
                      data={{
                        amount: formatUnits(loanItem.amount, asset.decimals),
                        margin: formatUnits(loanItem.margin, asset.decimals),
                        token: loanItem.token,
                        formattedPnl:
                          item?.pnl && fixPrecision(+item?.pnl, 2).toString(),
                        isPnlLoading: item?.isPnlLoading,
                        leverage: isDebitService
                          ? (
                              +formatUnits(loanItem.amount, asset.decimals) /
                                +formatUnits(loanItem.margin, asset.decimals) +
                              1
                            ).toString()
                          : undefined,
                        pnl: item?.pnl,
                        pnlPercentage:
                          item?.pnlPercentage &&
                          fixPrecision(+item?.pnlPercentage, 2).toString(),
                        id: item.id,
                        quote: item.quote,
                        type: item.type,
                        name: item.name,
                        createdAt: item.agreement?.createdAt,
                      }}
                    />
                  );
                })
              )
            : !isLoadingClosed &&
              activeView === "Closed" &&
              closedPositions.map((item, key) =>
                item.agreement?.loans.map((loanItem) => {
                  const loanAmount = item.agreement
                    ? item.agreement?.loans[0].amount
                    : 0n;
                  const loanMargin = item.agreement
                    ? item.agreement?.loans[0].margin
                    : 0n;
                  return (
                    <CloseTRow
                      key={key}
                      data={{
                        createdAt: item.agreement?.createdAt,
                        margin: fixPrecision(Number(loanItem.margin), 2),
                        token: loanItem.token,
                        type: item.type,
                        leverage: (loanAmount / loanMargin + 1n).toString(),
                      }}
                    />
                  );
                })
              )}

          {isLoadingPositions &&
            activeView === "Active" &&
            Array.from({ length: 4 }).map((_, index) => (
              <TRowLoading tdCount={6} key={index} />
            ))}
          {isLoadingClosed &&
            activeView === "Closed" &&
            Array.from({ length: 4 }).map((_, index) => (
              <TRowLoading tdCount={4} key={index} />
            ))}
        </Tbody>
      </DefaultTable>
      {isPositionsExist && !isLoadingPositions && activeView === "Active" && (
        <div className="flex items-center justify-center w-full text-lg font-bold h-96 text-primary-900">
          <p>You don&apos;t have any recorded open positions.</p>
        </div>
      )}
      {isClosedExist && !isLoadingClosed && activeView === "Closed" && (
        <div className="flex items-center justify-center w-full text-lg font-bold h-96 text-primary-900">
          <p>You don&apos;t have any recorded closed positions.</p>
        </div>
      )}
    </TableContainer>
  );
};

export default Table;
