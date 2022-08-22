/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { number } from 'yup';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';
import Button from '@/components/based/Button';
import DataTable from '@/components/based/table/DataTable';
import {
  TokenPair,
  CloseButton,
} from '@/components/composed/dashboard/TableCell';
import { useLiquidatedPositions } from '@/hooks/useLiquidatedPositions';
import { useOpenedPositions } from '@/hooks/useOpenedPositions';
import { useClosedPositions } from '@/hooks/useClosedPositions';
import { getTokenByAddress } from '@/global/utils';
// import { POSITION_CHART_OPTIONS } from '@/global/constants';
import ClosePositionModal from '@/components/composed/common/ClosePositionModal';
import DashboardTableRow from '@/components/composed/dashboard/DashboardTableRow';
import { PositionOpenType } from '@/global/types';
import { STRATEGIES } from '@/global/constants';

// export const data = {
//   labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   datasets: [
//     {
//       data: [0, 3, 21, -23, 235, -23, 1, 24, 64, -56],
//       borderColor: 'rgb(255, 99, 132)',
//     },
//   ],
// };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<PositionOpenType>('active');
  const [closePositionModalOpened, setClosePositionModalOpened] =
    useState(false);

  const openedPositions = useOpenedPositions(STRATEGIES.MarginTradingStrategy);
  const closedPositions = useClosedPositions(STRATEGIES.MarginTradingStrategy);
  const liquidatedPositions = useLiquidatedPositions(
    STRATEGIES.MarginTradingStrategy
  );

  const displayedPositions = useMemo(() => {
    if (!openedPositions || !closedPositions || !liquidatedPositions)
      return null;
    switch (activeTab) {
      case 'active':
        return openedPositions.filter(
          (position) =>
            !closedPositions.includes(position.id) &&
            !liquidatedPositions.includes(position.id)
        );
      case 'closed':
        return openedPositions.filter((position) =>
          closedPositions.includes(position.id)
        );
      case 'liquidated':
        return openedPositions.filter((position) =>
          liquidatedPositions.includes(position.id)
        );
    }
  }, [openedPositions, closedPositions, activeTab, liquidatedPositions]);

  const handleRowClick = (idx: number) => {
    if (!displayedPositions || !displayedPositions.length) return;
    navigate(`/dashboard/position?id=${displayedPositions[idx].id}`);
  };

  return (
    <Container>
      <ClosePositionModal
        open={closePositionModalOpened}
        selectedId={selectedId}
        onClose={() => setClosePositionModalOpened(false)}
      />
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12"> Dashboard </Txt.Heading1>
          <div tw="flex flex-row justify-center items-center gap-3 self-start mb-4">
            <Txt.Body1Regular>View:</Txt.Body1Regular>
            <Button
              text="Active"
              action={activeTab === 'active'}
              bold={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
            />
            <Button
              text="Closed"
              action={activeTab === 'closed'}
              bold={activeTab === 'closed'}
              onClick={() => setActiveTab('closed')}
            />
            <Button
              text="Liquidated"
              action={activeTab === 'liquidated'}
              bold={activeTab === 'liquidated'}
              onClick={() => setActiveTab('liquidated')}
            />
          </div>
          <DataTable
            head={[
              { id: 'token_pair', content: 'Token pair' },
              { id: 'position', content: 'Position' },
              { id: 'collateral', content: 'Collateral' },
              { id: 'profit', content: 'Profit' },
              { id: 'creation_time', content: 'Creation Time' },
              // { id: 'trend', content: 'Trend' },
            ].concat(
              activeTab === 'active' ? [{ id: 'action', content: '' }] : []
            )}
            data={
              displayedPositions?.map((position) => {
                const collateralTokenSymbol = getTokenByAddress(
                  position.collateralToken
                )?.symbol;
                const investmentTokenSymbol = getTokenByAddress(
                  position.collateralToken == position.heldToken
                    ? position.owedToken
                    : position.heldToken
                )?.symbol;
                const creationDate = new Date(
                  Number(position.createdAt.toString()) * 1000
                );

                return {
                  token_pair: (
                    <TokenPair
                      investmentTokenSymbol={investmentTokenSymbol || 'WETH'}
                      collateralTokenSymbol={collateralTokenSymbol || 'DAI'}
                    />
                  ),
                  position: null,
                  position_info: JSON.stringify(position),
                  position_status: activeTab,
                  collateral: null,
                  profit: null,
                  creation_time: (
                    <Txt.Body2Regular>
                      {creationDate.toLocaleString()}
                    </Txt.Body2Regular>
                  ),
                  // trend: (
                  //   <div css={[tw`width[100px] height[35px] -mt-4`]}>
                  //     <Line options={POSITION_CHART_OPTIONS} data={data} />
                  //   </div>
                  // ),
                  action: (
                    <CloseButton
                      onClick={() => {
                        setSelectedId(Number(position.id));
                        setClosePositionModalOpened(true);
                      }}
                    />
                  ),
                };
              }) || []
            }
            loading={!displayedPositions}
            hoverable
            RowComponent={DashboardTableRow}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </Container>
  );
}
