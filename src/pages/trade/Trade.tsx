/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Txt from '@/components/based/Txt';
import Container from '@/components/based/Container';
import { TRADE_STRATEGIES } from '@/global/constants';
import { StrategyWidget } from '@/components/composed/trade/StrategyWidget';

const TradePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12">Trading strategies</Txt.Heading1>

          <div tw="flex flex-row gap-x-4 flex-wrap gap-y-4 justify-center">
            {TRADE_STRATEGIES.map((strategy) => (
              <StrategyWidget
                key={strategy.id}
                {...strategy}
                onClick={() => strategy.url && navigate(strategy.url)}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TradePage;
