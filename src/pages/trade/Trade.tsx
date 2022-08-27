/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Page from '@/components/based/Page';
import { TRADE_STRATEGIES } from '@/global/constants';
import { StrategyWidget } from '@/components/composed/trade/StrategyWidget';

const TradePage = () => {
  const navigate = useNavigate();

  return (
    <Page heading="Trading Strategies">
      <div
        tw="flex flex-row gap-x-4 flex-wrap gap-y-4 justify-center"
        id="strategies"
      >
        {TRADE_STRATEGIES.map((strategy) => (
          <StrategyWidget
            key={strategy.id}
            {...strategy}
            onClick={() => strategy.url && navigate(strategy.url)}
          />
        ))}
      </div>
    </Page>
  );
};

export default TradePage;
