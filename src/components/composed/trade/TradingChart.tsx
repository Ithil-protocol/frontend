/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useState } from 'react';

import { TokenDetails } from 'src/global/types';
import Txt from 'src/components/based/Txt';
import TabButton from 'src/components/based/TabButton';
import TradingViewAdvancedChart from 'src/components/based/charts/TradingViewAdvancedChart';
import TradingViewBasicChart from 'src/components/based/charts/TradingViewBasicChart';

interface ITradingChart {
  firstToken: TokenDetails;
  secondToken: TokenDetails;
  disableTrading?: boolean;
}

const TradingChart: FC<ITradingChart> = ({
  firstToken: obtainedToken,
  secondToken: spentToken,
  disableTrading,
}) => {
  const [activeChart, setActiveChart] = useState<'basic' | 'trading'>('basic');
  return (
    <div tw="w-full [height:500px] tablet:[height:500px] desktop:[height:700px] desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100">
      <div tw="w-full flex tablet:flex-row tablet:justify-between pb-5 mobile:flex-col mobile:items-center">
        <Txt.Heading2>{`${obtainedToken.symbol}/${spentToken.symbol}`}</Txt.Heading2>
        {!disableTrading && (
          <div tw="flex flex-row items-center gap-1">
            <Txt.Body2Regular tw="tablet:[display:initial] mr-4 mobile:hidden">
              View:
            </Txt.Body2Regular>
            <TabButton
              text="Basic"
              active={activeChart === 'basic'}
              onClick={() => setActiveChart('basic')}
            />

            <TabButton
              text="Trading"
              active={activeChart === 'trading'}
              onClick={() => setActiveChart('trading')}
            />
          </div>
        )}
      </div>
      <div tw="w-full h-full  flex flex-col">
        {activeChart === 'basic' ? (
          <TradingViewBasicChart
            tokenSymbol={`${obtainedToken.symbol}${spentToken.symbol}`}
          />
        ) : (
          <TradingViewAdvancedChart
            tokenSymbol={`${obtainedToken.symbol}${spentToken.symbol}`}
          />
        )}
      </div>
    </div>
  );
};

export default TradingChart;
