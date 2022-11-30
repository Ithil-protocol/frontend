/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Txt from 'src/components/based/Txt';
import Button from 'src/components/based/Button';
import DataTable from 'src/components/based/table/DataTable';
import {
  TokenPair,
  CloseButton,
} from 'src/components/composed/dashboard/TableCell';
import {
  getPoolNameByAddress,
  getStrategyByType,
  getTokenByAddress,
} from 'src/global/utils';
import ClosePositionModal from 'src/components/composed/common/ClosePositionModal';
import DashboardTableRow from 'src/components/composed/dashboard/DashboardTableRow';
import Page from 'src/components/based/Page';
import {
  ClosedPositionType,
  PositionOpenType,
  StrategyContractType,
} from 'src/global/types';
import { useChainId } from 'src/hooks';
import { useFilterdPositions } from 'src/hooks/useFilteredPositions';

export default function DashboardPage() {
  const navigate = useNavigate();
  const chainId = useChainId();
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [selectedStrategy, setSelectedStrategy] =
    useState<StrategyContractType>();
  const [activeTab, setActiveTab] = useState<PositionOpenType>('active');
  const [closePositionModalOpened, setClosePositionModalOpened] =
    useState(false);

  const filteredPositions = useFilterdPositions(activeTab);

  const displayedPositions = useMemo(() => {
    if (!filteredPositions) return null;
    return filteredPositions.sort(
      (a, b) => b.createdAt.toNumber() - a.createdAt.toNumber()
    );
  }, [filteredPositions]);

  const handleRowClick = (idx: number) => {
    if (!displayedPositions || !displayedPositions.length) return;
    navigate(`/dashboard/position?id=${displayedPositions[idx].id}`);
  };

  return (
    <Page heading="Dashboard">
      {selectedStrategy && (
        <ClosePositionModal
          open={closePositionModalOpened}
          selectedId={selectedId}
          onClose={() => setClosePositionModalOpened(false)}
          strategy={selectedStrategy}
        />
      )}
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
          { id: 'token_pair', content: 'Assets' },
          { id: 'position', content: 'Strategy' },
          { id: 'collateral', content: 'Collateral' },
        ]
          .concat(
            activeTab === 'closed'
              ? [{ id: 'amount_out', content: 'AmoutOut' }]
              : []
          )
          .concat(
            activeTab === 'active'
              ? [{ id: 'profit', content: 'Performance' }]
              : []
          )
          .concat(
            activeTab === 'active' ? [{ id: 'action', content: '' }] : []
          )}
        data={
          displayedPositions?.map((position) => {
            const collateralTokenSymbol = getTokenByAddress(
              position.collateralToken,
              chainId
            )?.symbol;
            const investmentTokenSymbol =
              position.type === 'margin'
                ? getTokenByAddress(
                    position.collateralToken == position.heldToken
                      ? position.owedToken
                      : position.heldToken,
                    chainId
                  )?.symbol
                : position.type === 'balancer'
                ? getPoolNameByAddress(
                    position.collateralToken == position.heldToken
                      ? position.owedToken
                      : position.heldToken
                  )
                : `y${collateralTokenSymbol}`;
            const positionId = position.id.split('_')[0];
            const strategy = getStrategyByType(position.type, chainId);

            return {
              token_pair: (
                <TokenPair
                  investmentTokenSymbol={investmentTokenSymbol || ''}
                  collateralTokenSymbol={collateralTokenSymbol || ''}
                />
              ),
              position: null,
              position_info: JSON.stringify(position),
              position_status: activeTab,
              collateral: null,
              amount_out: (position as ClosedPositionType).amountOut,
              profit: null,
              action: (
                <CloseButton
                  onClick={() => {
                    setSelectedId(Number(positionId));
                    setSelectedStrategy(strategy);
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
    </Page>
  );
}
