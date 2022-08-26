/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, SetStateAction, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import Txt from '@/components/based/Txt';
import { YEARN_API_URL } from '@/global/constants';
import fetchAPI from '@/global/api';
import { TokenDetails } from '@/global/types';
import { useTheme } from '@/state/application/hooks';

const SCALING_FACTOR = 100;

interface IYearnChart {
  spentToken: TokenDetails;
  setBaseApy?: {
    (value: SetStateAction<number>): void;
    (arg0: number): void;
  };
}

const YearnChart: FC<IYearnChart> = ({ spentToken, setBaseApy }) => {
  const theme = useTheme();
  const [yearnData, setYearnData] = useState<any[]>();
  const [chartData, setChartData] = useState<any>([]);
  const CHART_OPTIONS = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.3,
        borderWidth: 1,
      },
    },
    scales: {
      xAxis: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          borderColor: theme === 'dark' ? '#ffffff82' : '#00000082',
          color: theme === 'dark' ? '#ffffff13' : '#00000013',
          borderDash: [5, 5, 5],
        },
        ticks: {
          display: true,
        },
      },
      yAxis: {
        display: true,
        title: {
          display: true,
          text: 'APY',
        },
        grid: {
          borderColor: theme === 'dark' ? '#ffffff82' : '#00000082',
          color: theme === 'dark' ? '#ffffff13' : '#00000013',
          borderDash: [5, 5, 5],
        },
      },
    },
  };

  useEffect(() => {
    fetchAPI(`${YEARN_API_URL}chains/1/vaults/all`).then((res) => {
      setYearnData(res);
    });
  }, []);

  useEffect(() => {
    if (yearnData && spentToken) {
      if (spentToken.symbol === 'DAI') {
        setBaseApy && setBaseApy(yearnData[90].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[90].apy.points.inception * SCALING_FACTOR,
          yearnData[90].apy.points.month_ago * SCALING_FACTOR,
          yearnData[90].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'USDC') {
        setBaseApy && setBaseApy(yearnData[38].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[38].apy.points.inception * SCALING_FACTOR,
          yearnData[38].apy.points.month_ago * SCALING_FACTOR,
          yearnData[38].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'LINK') {
        setBaseApy && setBaseApy(yearnData[82].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[82].apy.points.inception * SCALING_FACTOR,
          yearnData[82].apy.points.month_ago * SCALING_FACTOR,
          yearnData[82].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'WETH') {
        setBaseApy && setBaseApy(yearnData[42].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[42].apy.points.inception * SCALING_FACTOR,
          yearnData[42].apy.points.month_ago * SCALING_FACTOR,
          yearnData[42].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'WBTC') {
        setBaseApy && setBaseApy(yearnData[57].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[57].apy.points.inception * SCALING_FACTOR,
          yearnData[57].apy.points.month_ago * SCALING_FACTOR,
          yearnData[57].apy.points.week_ago * SCALING_FACTOR,
        ]);
      }
    }
  }, [yearnData, spentToken, setBaseApy]);

  const data = {
    labels: ['inception', 'month ago', 'week ago'],
    datasets: [
      {
        data: chartData,
        borderColor: theme === 'dark' ? '#fff' : '#000',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div tw="w-full height[:auto] desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100">
      <Txt.Body1Bold>APY Chart</Txt.Body1Bold>
      <Line options={CHART_OPTIONS} data={data} />
    </div>
  );
};

export default YearnChart;
