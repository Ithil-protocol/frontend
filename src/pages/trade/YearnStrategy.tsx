/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useEffect, useMemo, useState } from 'react';
import { FadersHorizontal } from 'phosphor-react';
import { Line } from 'react-chartjs-2';
import BigNumber from 'bignumber.js';
import { useEthers } from '@usedapp/core';
import { MaxUint256 } from '@ethersproject/constants';

import { TokenDetails } from '@/global/types';
import Txt from '@/components/based/Txt';
import SliderBar from '@/components/based/Slidebar';
import InputField from '@/components/based/InputField';
import Container from '@/components/based/Container';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import TokenInputField from '@/components/composed/trade/TokenInputField';
import { parseAmount } from '@/global/utils';
import { useLatestVault } from '@/hooks/useYearnRegistry';
import { useQuoter } from '@/hooks/useQuoter';
import {
  MAX_LEVERAGE,
  STRATEGIES,
  DEFAULT_DEADLINE,
  TOKEN_LIST,
  YEARN_API_URL,
} from '@/global/constants';
import { useAllowance, useApprove } from '@/hooks/useToken';
import fetchAPI from '@/global/api';
import { useOpenPosition } from '@/hooks/useOpenPosition';
import { useTheme } from '@/state/application/hooks';

const SCALING_FACTOR = 100;

export default function YearnStrategyPage() {
  const theme = useTheme();
  const { account } = useEthers();

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

  const [spentToken, setSpentToken] = useState<TokenDetails>(TOKEN_LIST[0]);
  const [marginAmount, setMarginAmount] = useState<string>('0');
  const [leverage, setLeverage] = useState<number>(1);

  const [baseApy, setBaseApy] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);

  const [yearnData, setYearnData] = useState<any[]>();
  const [slippagePercent, setSlippagePercent] = useState<string>(
    STRATEGIES.YearnStrategy.defaultSlippage
  );
  const [deadline, setDeadline] = useState<string>(DEFAULT_DEADLINE);
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);

  const obtainedTokenAddress = useLatestVault(spentToken.address);

  const slippageValue = useMemo(() => {
    return (100 - Number(slippagePercent)) / 100;
  }, [slippagePercent]);

  const maxSpent = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals).multipliedBy(
      leverage
    );
  }, [leverage, marginAmount, spentToken]);

  const quoteValue = useQuoter(
    spentToken.address,
    obtainedTokenAddress,
    maxSpent,
    STRATEGIES.YearnStrategy
  );

  const minObtained = useMemo(() => {
    return quoteValue.multipliedBy(slippageValue);
  }, [quoteValue, slippageValue]);

  const allowance = useAllowance(
    spentToken.address,
    STRATEGIES.YearnStrategy.address
  );

  const { isLoading: isLoadingApprove, approve } = useApprove(
    spentToken.address
  );

  const { isLoading: isLoadingOpenPos, openPosition } = useOpenPosition(
    STRATEGIES.YearnStrategy
  );

  const buttonText = useMemo(() => {
    if (!allowance) return 'Open';
    const marginedAmountValue = parseAmount(marginAmount, spentToken.decimals);

    if (new BigNumber(allowance.toString()).isLessThan(marginedAmountValue)) {
      return 'Approve';
    }
    return 'Open';
  }, [allowance, marginAmount, spentToken.decimals]);

  useEffect(() => {
    fetchAPI(`${YEARN_API_URL}chains/1/vaults/all`).then((res) => {
      setYearnData(res);
    });
  }, []);

  useEffect(() => {
    setInterestRate((leverage - 1) * 0.1);
  }, [leverage]);

  useEffect(() => {
    if (yearnData && spentToken) {
      if (spentToken.symbol === 'DAI') {
        setBaseApy(yearnData[90].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[90].apy.points.inception * SCALING_FACTOR,
          yearnData[90].apy.points.month_ago * SCALING_FACTOR,
          yearnData[90].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'USDC') {
        setBaseApy(yearnData[38].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[38].apy.points.inception * SCALING_FACTOR,
          yearnData[38].apy.points.month_ago * SCALING_FACTOR,
          yearnData[38].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'LINK') {
        setBaseApy(yearnData[82].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[82].apy.points.inception * SCALING_FACTOR,
          yearnData[82].apy.points.month_ago * SCALING_FACTOR,
          yearnData[82].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'WETH') {
        setBaseApy(yearnData[42].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[42].apy.points.inception * SCALING_FACTOR,
          yearnData[42].apy.points.month_ago * SCALING_FACTOR,
          yearnData[42].apy.points.week_ago * SCALING_FACTOR,
        ]);
      } else if (spentToken.symbol === 'WBTC') {
        setBaseApy(yearnData[57].apy.net_apy * SCALING_FACTOR);
        setChartData([
          yearnData[57].apy.points.inception * SCALING_FACTOR,
          yearnData[57].apy.points.month_ago * SCALING_FACTOR,
          yearnData[57].apy.points.week_ago * SCALING_FACTOR,
        ]);
      }
    }
  }, [yearnData, spentToken]);

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

  const handleApprove = () => {
    if (!account || !Number(marginAmount)) return;
    approve(STRATEGIES.YearnStrategy.address, MaxUint256);
  };

  const handleOpenOrder = async () => {
    if (!account) return;
    const deadlineTimestamp =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);
    const newOrder = {
      spentToken: spentToken.address,
      obtainedToken: obtainedTokenAddress,
      collateral: parseAmount(marginAmount, spentToken.decimals).toFixed(0),
      collateralIsSpentToken: true,
      minObtained: minObtained.toFixed(0),
      maxSpent: maxSpent.toFixed(0),
      deadline: deadlineTimestamp,
    };
    openPosition(newOrder, { gasLimit: 700_000 });
  };

  const handleExecute = () => {
    if (buttonText === 'Approve') {
      handleApprove();
    } else {
      handleOpenOrder();
    }
  };

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full tablet:w-9/12 desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12">Yearn Strategy</Txt.Heading1>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col gap-3 flex-grow w-full desktop:w-4/12">
              <div tw="flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7">
                <div tw="flex w-full justify-between items-center" id="margin">
                  <TokenInputField
                    label="Margin"
                    availableTokens={TOKEN_LIST}
                    value={marginAmount}
                    setValue={setMarginAmount}
                    stateChanger={setMarginAmount}
                    token={spentToken}
                    onTokenChange={(value) => setSpentToken(value)}
                  />
                </div>
                <SliderBar
                  id="leverage"
                  label=""
                  tooltipText=""
                  min={1}
                  max={MAX_LEVERAGE}
                  step={0.2}
                  value={leverage}
                  onChange={(value) => setLeverage(value as number)}
                  marks={{
                    1: '1x',
                    2: '2x',
                    3: '3x',
                    4: '4x',
                    5: '5x',
                  }}
                />
                <div tw="w-full">
                  <InfoItem
                    tooltipText="The max amount you invest including collateral"
                    label="Max Spent"
                    value={
                      maxSpent
                        ? formatAmount(maxSpent, spentToken.decimals)
                        : '-'
                    }
                    details={spentToken.symbol}
                  />
                  <InfoItem
                    tooltipText="Base annualised profit offered by the strategy"
                    label="Base APY"
                    value={`${baseApy.toFixed(2)}x`}
                  />
                  <InfoItem
                    tooltipText="The capital boost on the margin invested"
                    label="Multiplier"
                    value={`${leverage}x`}
                  />
                  <InfoItem
                    tooltipText="Percentage to be paid as borrowing fees"
                    label="Borrow Interest"
                    value={`${interestRate.toFixed(2)}%`}
                  />
                  <InfoItem
                    tooltipText="Maximum amount to be spent in the position, including collateral"
                    label="Estimated APY"
                    value={`${(leverage * baseApy - interestRate).toFixed(2)}%`}
                  />
                </div>
                <div tw="w-full">
                  {showAdvancedOptions ? (
                    <>
                      <div tw="my-4 w-full flex flex-row justify-between items-center">
                        <Txt.Heading2>Advanced options</Txt.Heading2>
                        <div>
                          <button
                            tw="my-4 w-full flex justify-center items-center gap-2"
                            onClick={() =>
                              setShowAdvancedOptions(!showAdvancedOptions)
                            }
                          >
                            <FadersHorizontal size={20} tw="text-font-100" />
                          </button>{' '}
                        </div>
                      </div>

                      <div tw="flex flex-col w-full gap-7">
                        <InputField
                          tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                          label="Slippage"
                          placeholder="0"
                          value={slippagePercent}
                          onChange={(value) => setSlippagePercent(value)}
                          renderRight={
                            <Txt.InputText tw="text-font-100">%</Txt.InputText>
                          }
                        />
                        <InputField
                          tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                          label="Deadline"
                          placeholder="30 mins"
                          value={deadline}
                          onChange={(value) => setDeadline(value)}
                          renderRight={
                            <Txt.InputText tw="text-font-100">
                              min
                            </Txt.InputText>
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      tw="my-4 w-full flex justify-center items-center gap-2"
                      onClick={() =>
                        setShowAdvancedOptions(!showAdvancedOptions)
                      }
                    >
                      <FadersHorizontal size={20} tw="text-font-100" />
                      <Txt.Body2Regular tw="text-font-100">
                        Advanced options
                      </Txt.Body2Regular>
                    </button>
                  )}
                </div>
                <Button
                  id="trade"
                  text={buttonText}
                  full
                  action
                  bold
                  disabled={!allowance}
                  onClick={handleExecute}
                  isLoading={isLoadingApprove || isLoadingOpenPos}
                />
              </div>
            </div>
            <div tw="w-full height[:auto] desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100">
              <Txt.Body1Bold>APY Chart</Txt.Body1Bold>
              <Line options={CHART_OPTIONS} data={data} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
