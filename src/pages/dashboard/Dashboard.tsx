/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';
import Button from '@/components/based/Button';
import DataTable from '@/components/based/table/DataTable';
import {
  PositionProfit,
  TokenPair,
  CloseButton,
} from '@/components/composed/dashboard/TableCell';
import {
  useClosedPositions,
  useOpenedPositions,
} from '@/hooks/useMarginTradingStrategy';
import { getTokenByAddress } from '@/global/utils';
import { POSITION_CHART_OPTIONS } from '@/global/constants';
import ClosePositionModal from '@/components/composed/common/ClosePositionModal';

type PositionOpenType = 'active' | 'closed';

export const data = {
  labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  datasets: [
    {
      data: [0, 3, 21, -23, 235, -23, 1, 24, 64, -56],
      borderColor: 'rgb(255, 99, 132)',
    },
  ],
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PositionOpenType>('active');
  const [closePositionModalOpened, setClosePositionModalOpened] =
    useState(false);

  const openedPositions = useOpenedPositions();
  const closedPositions = useClosedPositions();

  const displayedPositions = useMemo(() => {
    if (!openedPositions || !closedPositions) return null;
    return openedPositions.filter(
      (position) =>
        (activeTab === 'active' && !closedPositions.includes(position.id)) ||
        (activeTab === 'closed' && closedPositions.includes(position.id))
    );
  }, [openedPositions, closedPositions, activeTab]);

  const handleRowClick = (idx: number) => {
    if (!displayedPositions || !displayedPositions.length) return;
    navigate(`/dashboard/position?id=${displayedPositions[idx].id}`);
  };

  return (
    <Container>
      <ClosePositionModal
        open={closePositionModalOpened}
        onClose={() => setClosePositionModalOpened(false)}
      />
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12"> Dashboard </Txt.Heading1>
          <div tw="flex flex-row justify-center items-center gap-3 self-start mb-4 ml-4">
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
          </div>
          <DataTable
            head={[
              { id: 'token_pair', content: 'Token pair' },
              { id: 'position', content: 'Position' },
              { id: 'profit', content: 'Profit' },
              { id: 'trend', content: 'Trend' },
              { id: 'action', content: '' },
            ]}
            data={
              displayedPositions?.map((position) => {
                const spentTokenSymbol = getTokenByAddress(
                  position.collateralToken
                )?.symbol;
                const obtainedTokenSymbol = getTokenByAddress(
                  position.heldToken
                )?.symbol;

                return {
                  token_pair: (
                    <TokenPair
                      spentTokenSymbol={spentTokenSymbol || 'WETH'}
                      obtainedTokenSymbol={obtainedTokenSymbol || 'DAI'}
                    />
                  ),
                  position: (
                    <Txt.Body2Regular>{`${spentTokenSymbol} 2x Long`}</Txt.Body2Regular>
                  ),
                  profit: (
                    <PositionProfit
                      percentageValue={15.6}
                      currencyValue={1240}
                    />
                  ),
                  trend: (
                    <div css={[tw`width[100px] height[35px] -mt-4`]}>
                      <Line options={POSITION_CHART_OPTIONS} data={data} />
                    </div>
                  ),
                  action: (
                    <CloseButton
                      onClick={() => setClosePositionModalOpened(true)}
                    />
                  ),
                };
              }) || []
            }
            loading={!displayedPositions}
            hoverable
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </Container>
  );
}
