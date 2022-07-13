/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import TabButton from '@/components/based/TabButton';
import { useTheme } from '@/state/application/hooks';
import { IntervalType } from '@/global/types';

interface ITradingViewBasicChart {
  tokenSymbol: string;
}

const TradingViewBasicChart: FC<ITradingViewBasicChart> = ({ tokenSymbol }) => {
  const theme = useTheme();

  const ref = useRef<any>();
  const [isMounted, setIsMounted] = useState(false);
  const [interval, setInterval] = useState<IntervalType>('1d');

  const loadScript = useCallback(
    (opts: any) => {
      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: tokenSymbol,
        width: '100%',
        height: '100%',
        locale: 'en',
        dateRange: opts.dateRange,
        colorTheme: theme ? 'dark' : 'light',
        trendLineColor: 'rgba(7, 124, 224, 1)',
        underLineColor: 'rgba(7, 124, 224, 0.3)',
        underLineBottomColor: 'rgba(7, 124, 224, 0)',
        isTransparent: true,
        autosize: false,
      });
      return script;
    },
    [interval, theme, tokenSymbol]
  );

  useEffect(() => {
    if (isMounted || !ref.current) {
      return;
    }
    const script = loadScript({ dateRange: interval });
    const rootNode = document.createElement('div');
    rootNode.classList.add('tradingview-widget-container__widget');
    ref.current.appendChild(rootNode);
    ref.current.appendChild(script);
    setIsMounted(true);
  }, [ref.current]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    ref.current.innerHTML = '';
    const script = loadScript({ dateRange: interval });
    const rootNode = document.createElement('div');
    rootNode.classList.add('tradingview-widget-container__widget');
    ref.current.appendChild(rootNode);
    ref.current.appendChild(script);
  }, [interval, theme, tokenSymbol]);

  return (
    <>
      <div tw="flex flex-row w-full gap-2 justify-start mb-3">
        <TabButton
          tw="px-3 py-1"
          active={interval === '1d'}
          onClick={() => setInterval('1d')}
          text="1d"
        />
        <TabButton
          tw="px-3 py-1"
          active={interval === '1m'}
          onClick={() => setInterval('1m')}
          text="1m"
        />
        <TabButton
          tw="px-3 py-1"
          active={interval === '12m'}
          onClick={() => setInterval('12m')}
          text="1y"
        />
        <TabButton
          tw="px-3 py-1"
          active={interval === '60m'}
          onClick={() => setInterval('60m')}
          text="5y"
        />
      </div>
      <div tw="w-full h-full">
        <div className="tradingview-widget-container" ref={ref} />
      </div>
    </>
  );
};

export default TradingViewBasicChart;
