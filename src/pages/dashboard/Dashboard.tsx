/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';
import Button from '@/components/based/Button';
import DataTable from '@/components/based/table/DataTable';
import {
  PositionProfit,
  TokenPair,
  CloseButton,
} from '@/components/composed/dashboard/TableCell';

type PositionOpenType = 'active' | 'closed';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PositionOpenType>('active');

  const handleRowClick = (id: number) => {
    navigate(`/dashboard/position?id=${id}`);
  };

  return (
    <Container>
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
            data={[
              {
                token_pair: (
                  <TokenPair
                    spentTokenSymbol="WETH"
                    obtainedTokenSymbol="DAI"
                  />
                ),
                position: <Txt.Body2Regular>ETH 2x Long</Txt.Body2Regular>,
                profit: (
                  <PositionProfit percentageValue={15.6} currencyValue={1240} />
                ),
                trend: <Txt.Body2Regular>Graph</Txt.Body2Regular>,
                action: <CloseButton onClick={() => console.log('hello')} />,
              },
            ]}
            loading={false}
            hoverable
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </Container>
  );
}
