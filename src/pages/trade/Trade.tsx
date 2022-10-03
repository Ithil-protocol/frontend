/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React from 'react';

import Page from '@/components/based/Page';
import DataTable from '@/components/based/table/DataTable';
import Txt from '@/components/based/Txt';
import { TRADE_STRATEGIES } from '@/global/constants';
import TradeTableRow from '@/components/composed/trade/TradeTableRow';

const TradePage = () => {
  return (
    <Page heading="Trading Strategies">
      <div
        tw="laptop:flex laptop:width[initial] flex-row gap-x-4 flex-wrap gap-y-4 justify-center laptop:min-width[800px] mobile:display[initial] mobile:min-width[initial] mobile:w-full mt-2"
        id="strategies"
      >
        <DataTable
          head={[
            {
              id: 'title',
              content: (
                <div tw="flex items-center gap-2 justify-center">
                  <Txt.Body2Regular tw="text-font-100">
                    Strategy
                  </Txt.Body2Regular>
                </div>
              ),
            },
            {
              id: 'exposure',
              content: (
                <div tw="flex items-center gap-2 justify-center">
                  <Txt.Body2Regular tw="text-font-100">
                    Exposure
                  </Txt.Body2Regular>
                </div>
              ),
            },
            {
              id: 'description',
              content: (
                <div tw="flex items-center gap-2 justify-center">
                  <Txt.Body2Regular tw="text-font-100">
                    Description
                  </Txt.Body2Regular>
                </div>
              ),
            },
            {
              id: 'utilisation_rate',
              content: (
                <div tw="flex items-center gap-2 justify-center">
                  <Txt.Body2Regular tw="text-font-100">
                    Utilisation Rate
                  </Txt.Body2Regular>
                </div>
              ),
            },
            {
              id: 'risk_profile',
              content: (
                <div tw="flex items-center gap-2 justify-center">
                  <Txt.Body2Regular tw="text-font-100">
                    Risk profile
                  </Txt.Body2Regular>
                </div>
              ),
            },
            { id: 'action', content: '' },
          ]}
          data={TRADE_STRATEGIES.map((strategy) => ({
            title: strategy.title,
            exposure: null,
            description: strategy.description,
            utilisation_rate: strategy.uRate,
            risk_profile: strategy.risk,
            action: null,
            url: strategy.url,
          }))}
          loading={false}
          RowComponent={TradeTableRow}
        />
      </div>
    </Page>
  );
};

export default TradePage;
