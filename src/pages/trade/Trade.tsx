/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React from 'react';
import { Localhost } from '@usedapp/core';

import Page from '@/components/based/Page';
import DataTable from '@/components/based/table/DataTable';
import Txt from '@/components/based/Txt';
import { TRADE_STRATEGIES } from '@/global/constants';
import TradeTableRow from '@/components/composed/trade/TradeTableRow';
import Tooltip from '@/components/based/Tooltip';
import { useChainId } from '@/hooks';

const TradePage = () => {
  const chainId = useChainId();
  return (
    <Page heading="Trading Strategies">
      <div
        tw="laptop:flex laptop:w-full flex-row gap-x-4 flex-wrap gap-y-4 justify-center laptop:min-width[800px] mobile:display[initial] mobile:min-width[initial] mobile:w-full mt-2"
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
                  <Tooltip text="Exposure" />
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
                  <Tooltip text="Utilisation Rate" />
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
                  <Tooltip text="Risk profile" />
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
            url:
              strategy.id === 4 && chainId !== Localhost.chainId
                ? ''
                : strategy.url,
          }))}
          loading={false}
          RowComponent={TradeTableRow}
        />
      </div>
    </Page>
  );
};

export default TradePage;
