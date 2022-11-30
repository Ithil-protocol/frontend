/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import Txt from 'src/components/based/Txt';
import { useTheme } from 'src/state/application/hooks';
import tw from 'twin.macro';

interface IVaultData {
  baseFee: BigNumber;
  netLoans: BigNumber;
  insuranceReserveBalance: BigNumber;
}

interface IVaultChart {
  vaultData: IVaultData | undefined;
  utilisationRate: BigNumber | 0;
  balance: BigNumber | 0;
}

const VaultChart: FC<IVaultChart> = ({ vaultData, utilisationRate }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>([]);
  const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
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

  const data = {
    labels: [...Array(101)].map((_, idx) => idx),
    datasets: [
      {
        data: chartData,
        borderColor: theme === 'dark' ? '#fff' : '#000',
        borderWidth: 2,
      },
    ],
  };

  const calcInterestRate = (utilization: number) => {
    if (!vaultData) return;
    const baseFee = BigNumber(vaultData.baseFee.toString());
    const netLoans = BigNumber(vaultData.netLoans.toString());
    const insuranceReserveBalance = BigNumber(
      vaultData.insuranceReserveBalance.toString()
    );
    const calced = netLoans.minus(insuranceReserveBalance);
    return Number(
      BigNumber(utilization)
        .multipliedBy(
          (calced.isGreaterThan(0) ? calced : BigNumber(0))
            .plus(1)
            .dividedBy(netLoans)
        )
        .plus(baseFee)
        .dividedBy(20000)
        .toString()
    );
  };

  useEffect(() => {
    setChartData([...Array(101)].map((_, idx) => calcInterestRate(idx)));
    /*
    if (vaultData && utilisationRate !== 0 && balance !== 0) {
      if (vaultData.insuranceReserveBalance > vaultData.netLoans) {
        setChartData(vaultData.baseFee.toNumber() + utilisationRate.toNumber());
      } else {
        setChartData(
          vaultData.baseFee.toNumber() +
            (2 -
              vaultData.insuranceReserveBalance.toNumber() /
                (utilisationRate.toNumber() * balance.toNumber())) *
              utilisationRate.toNumber()
        );
      }
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilisationRate, vaultData]);

  return (
    <div
      css={[
        tw`mobile:pb-12 desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100`,
        tw`laptop:w-full laptop:box-border laptop:[max-height:initial]`,
        tw`desktop:p-10`,
        tw`[height:auto] [max-height:500px]`,
      ]}
    >
      <Txt.Body1Bold>Vault Chart</Txt.Body1Bold>
      <Line
        options={CHART_OPTIONS}
        data={data}
        style={{ maxHeight: '500px' }}
      />
    </div>
  );
};

export default VaultChart;
