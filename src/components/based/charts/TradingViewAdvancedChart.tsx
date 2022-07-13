import React, { FC, useEffect } from 'react';

import { useTheme } from '@/state/application/hooks';

interface ITradingViewAdvancedChart {
  tokenSymbol: string;
}

const TradingViewAdvancedChart: FC<ITradingViewAdvancedChart> = ({
  tokenSymbol,
}) => {
  const theme = useTheme();

  useEffect(() => {
    const tradingChartProperites = {
      width: `100%`,
      height: '100%',
      symbol: `${tokenSymbol}`,
      // BINANCE:ETHBTC
      timezone: 'Etc/UTC',
      theme: theme,
      style: 1,
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      withdateranges: true,
      range: 'YTD',
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      calendar: true,
      container_id: 'chart',
    };
    new (window as any).TradingView.widget(tradingChartProperites);
  }, [theme, tokenSymbol]);

  return <div id="chart" />;
};

export default TradingViewAdvancedChart;
