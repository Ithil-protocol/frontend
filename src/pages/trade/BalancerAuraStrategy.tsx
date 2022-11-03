/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useEffect, useMemo, useState } from 'react';
import { FadersHorizontal } from 'phosphor-react';
import BigNumber from 'bignumber.js';
import { Localhost, useEthers, useTokenBalance } from '@usedapp/core';
import { MaxUint256 } from '@ethersproject/constants';
import { formatUnits } from '@ethersproject/units';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

import { PoolDetails, TokenDetails } from '@/global/types';
import Txt from '@/components/based/Txt';
import SliderBar from '@/components/based/Slidebar';
import InputField from '@/components/based/InputField';
import Page from '@/components/based/Page';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import TokenInputField from '@/components/composed/trade/TokenInputField';
import { formatAmount, parseAmount } from '@/global/utils';
import { useQuoter } from '@/hooks/useQuoter';
import { useAllowance, useApprove } from '@/hooks/useToken';
import { useOpenPosition } from '@/hooks/useOpenPosition';
import { useMaxLeverage } from '@/hooks/useMaxLeverage';
import APYChart from '@/components/composed/trade/APYChart';
import { DEFAULT_DEADLINE } from '@/global/constants';
import { STRATEGIES, BALANCER_POOLS } from '@/global/ithil';
import { useBorrowInterestRate } from '@/hooks/useBorrowInterestRate';
import TabsSwitch from '@/components/composed/trade/TabsSwitch';
import PoolSelect from '@/components/composed/trade/PoolSelect';
import { useChainId } from '@/hooks';

export default function BalancerAuraStrategyPage() {
  const { account } = useEthers();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [selectedPool, setSelectedPool] = useState<PoolDetails>(
    BALANCER_POOLS[0]
  );
  const [spentToken, setSpentToken] = useState<TokenDetails>(
    selectedPool.tokens[0]
  );
  const [marginAmount, setMarginAmount] = useState<string>('0');
  const [marginMaxPercent, setMarginMaxPercent] = useState<string>('1');
  const [leverage, setLeverage] = useState<number>(1);

  const [baseApy, setBaseApy] = useState<number>(0);

  const [slippagePercent, setSlippagePercent] = useState<string>(
    STRATEGIES[chainId].BalancerStrategy.defaultSlippage
  );
  const [deadline, setDeadline] = useState<string>(DEFAULT_DEADLINE);
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);

  const tokenBalance = useTokenBalance(spentToken.address, account);
  const obtainedTokenAddress = selectedPool.address;

  const slippageValue = useMemo(() => {
    return (100 - Number(slippagePercent)) / 100;
  }, [slippagePercent]);

  const maxSpent = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals).multipliedBy(
      leverage
    );
  }, [leverage, marginAmount, spentToken]);

  const marginAmountValue = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals);
  }, [marginAmount, spentToken]);

  const quoteValue = useQuoter(
    spentToken.address,
    obtainedTokenAddress,
    maxSpent,
    STRATEGIES[chainId].BalancerStrategy
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const minObtained = useMemo(() => {
    if (!quoteValue) return null;
    return quoteValue.multipliedBy(slippageValue);
  }, [quoteValue, slippageValue]);

  const borrowed = useMemo(() => {
    return maxSpent.comparedTo(marginAmountValue) > 0
      ? maxSpent.minus(marginAmountValue)
      : BigNumber(0);
  }, [maxSpent, marginAmountValue]);

  const maxLeverage = useMaxLeverage(
    spentToken.address,
    obtainedTokenAddress,
    marginAmountValue,
    STRATEGIES[chainId].BalancerStrategy,
    marginAmountValue
  );

  const allowance = useAllowance(
    spentToken.address,
    STRATEGIES[chainId].BalancerStrategy.address
  );

  const { isLoading: isLoadingApprove, approve } = useApprove(
    spentToken.address
  );

  const { isLoading: isLoadingOpenPos, openPosition } = useOpenPosition(
    STRATEGIES[chainId].BalancerStrategy
  );

  const borrowIR = useBorrowInterestRate(
    spentToken.address,
    obtainedTokenAddress,
    marginAmountValue,
    borrowed,
    minObtained || BigNumber(0),
    STRATEGIES[chainId].BalancerStrategy,
    true
  );

  const borrowInterestPercent = useMemo(() => {
    return borrowIR.dividedBy(100);
  }, [borrowIR]);

  const estimatedAPY = useMemo(() => {
    return leverage * (baseApy - borrowIR.dividedBy(100).toNumber());
  }, [baseApy, borrowIR, leverage]);

  const disabledButton = useMemo(() => {
    return borrowInterestPercent.comparedTo(5) === 1;
  }, [borrowInterestPercent]);

  const buttonText = useMemo(() => {
    if (!allowance) return 'Open';
    const marginedAmountValue = parseAmount(marginAmount, spentToken.decimals);

    if (new BigNumber(allowance.toString()).isLessThan(marginedAmountValue)) {
      return 'Approve';
    }
    return 'Open';
  }, [allowance, marginAmount, spentToken.decimals]);

  const handleApprove = () => {
    if (!account || !Number(marginAmount)) return;
    approve(STRATEGIES[chainId].BalancerStrategy.address, MaxUint256);
  };

  const handleOpenOrder = async () => {
    if (!account) {
      toast.error('Connect to a wallet!');
      return;
    }
    if (!tokenBalance || tokenBalance.isZero()) {
      toast.error('Purchase the spent tokens!');
      return;
    }
    if (
      Number(marginAmount) >
      Number(formatUnits(tokenBalance, spentToken.decimals))
    ) {
      toast.error('Invalid margin amount!');
      return;
    }
    const deadlineTimestamp =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);
    const newOrder = {
      spentToken: spentToken.address,
      obtainedToken: obtainedTokenAddress,
      collateral: parseAmount(marginAmount, spentToken.decimals).toFixed(0),
      collateralIsSpentToken: true,
      minObtained: 0,
      maxSpent: maxSpent.toFixed(0),
      deadline: deadlineTimestamp,
    };
    openPosition(newOrder, { gasLimit: 30_000_000 });
  };

  const handleExecute = () => {
    if (!marginAmount || Number(marginAmount) <= 0) {
      toast.error('Your margin is below minimum!');
      return;
    }
    if (buttonText === 'Approve') {
      handleApprove();
    } else {
      handleOpenOrder();
    }
  };

  const sliderMarks = useMemo(() => {
    const marks: { [key: number]: string } = {};
    if (maxLeverage === 1) return { 1: '1x' };
    const increment = (maxLeverage - 1) / 10;
    for (let i = 1; i <= maxLeverage; i += increment) {
      marks[i] = i == 1 ? `${formatAmount(i, 0, true, 2)}x` : ' ';
    }
    if (
      !Object.keys(marks)
        .map((mark) => Number(mark))
        .includes(maxLeverage)
    ) {
      marks[maxLeverage] = `${formatAmount(maxLeverage, 0, true, 2)}x`;
    }
    return marks;
  }, [maxLeverage]);

  useEffect(() => {
    setLeverage(1);
  }, [maxLeverage]);

  useEffect(() => {
    setSpentToken(selectedPool.tokens[0]);
  }, [selectedPool]);

  useEffect(() => {
    if (chainId !== Localhost.chainId) {
      navigate('/trade');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <Page
      heading="Balancer+Aura Strategy"
      description="Leveraged staking on the most common yVaults"
    >
      {disabledButton && (
        <div tw="fixed bottom-4 left-0 right-0 h-auto flex justify-center items-center">
          <div tw="bg-error p-4 w-auto rounded-lg text-white-100 font-bold">
            Borrow interest exceeds maximum (5%)
          </div>
        </div>
      )}
      <div tw="w-full flex flex-col desktop:flex-row gap-6">
        <div tw="flex flex-col gap-3 flex-grow w-full desktop:w-4/12">
          <div tw="flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7">
            <PoolSelect
              pool={selectedPool}
              availablePools={BALANCER_POOLS}
              onPoolChange={(pool) => setSelectedPool(pool)}
            />
            <div tw="flex w-full justify-between items-center" id="margin">
              <TokenInputField
                label="Margin"
                noMax
                availableTokens={selectedPool.tokens}
                value={marginAmount}
                setValue={setMarginAmount}
                stateChanger={setMarginAmount}
                onInput={() => setMarginMaxPercent('1')}
                token={spentToken}
                onTokenChange={(value) => {
                  setSpentToken(value);
                  setMarginAmount('0');
                  setMarginMaxPercent('1');
                }}
              />
            </div>
            <TabsSwitch
              activeIndex={marginMaxPercent}
              onChange={(value: string) => {
                setMarginMaxPercent(value);
                if (tokenBalance) {
                  setMarginAmount(
                    Number(
                      formatUnits(
                        tokenBalance.mul(Number(value)).div(100),
                        spentToken.decimals
                      )
                    ).toString()
                  );
                }
              }}
              items={[...Array(4)].map((_, idx) => ({
                title: `${(idx + 1) * 25}%`,
                value: `${(idx + 1) * 25}`,
              }))}
              theme="secondary"
              nospace
            />
            {Object.values(sliderMarks).length && maxLeverage ? (
              <SliderBar
                id="leverage"
                label="Leverage"
                tooltipText="The capital boost on the margin invested"
                min={1}
                max={maxLeverage}
                step={0.01}
                value={Number(leverage.toFixed(2))}
                onChange={(value) => setLeverage(value as number)}
                marks={sliderMarks}
              />
            ) : (
              <div tw="w-full">
                <Skeleton height={12} count={2} />
              </div>
            )}
            <div tw="w-full">
              <InfoItem
                tooltipText="The max amount you invest including collateral"
                label="Max Spent"
                value={
                  !maxSpent.isNaN()
                    ? formatAmount(maxSpent, spentToken.decimals)
                    : null
                }
                details={spentToken.symbol}
              />
              <InfoItem
                tooltipText="Base annualised profit offered by the strategy"
                label="Base APY"
                value={`${baseApy.toFixed(2)}x`}
              />
              <InfoItem
                tooltipText="Percentage to be paid as borrowing fees"
                label="Borrow Interest"
                value={
                  borrowInterestPercent.isNaN()
                    ? null
                    : `-${borrowInterestPercent.toFixed(2)}%`
                }
              />
              <InfoItem
                tooltipText="Maximum amount to be spent in the position, including collateral"
                label="Estimated APY"
                value={estimatedAPY ? `${estimatedAPY.toFixed(2)}%` : null}
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
                      tooltipText="Maximum tolerated price change"
                      label="Slippage"
                      placeholder="0"
                      value={slippagePercent}
                      onChange={(value) => setSlippagePercent(value)}
                      renderRight={
                        <Txt.InputText tw="text-font-100">%</Txt.InputText>
                      }
                    />
                    <InputField
                      tooltipText="Deadline for the execution time, if the transaction is executed afterwards it will revert"
                      label="Deadline"
                      placeholder="30 mins"
                      value={deadline}
                      onChange={(value) => setDeadline(value)}
                      renderRight={
                        <Txt.InputText tw="text-font-100">min</Txt.InputText>
                      }
                    />
                  </div>
                </>
              ) : (
                <button
                  tw="my-4 w-full flex justify-center items-center gap-2"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
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
              disabled={!allowance || disabledButton}
              onClick={handleExecute}
              isLoading={isLoadingApprove || isLoadingOpenPos}
            />
          </div>
        </div>
        <APYChart spentToken={spentToken} setBaseApy={setBaseApy} />
      </div>
    </Page>
  );
}
