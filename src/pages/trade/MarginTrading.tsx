/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, FadersHorizontal, XCircle } from 'phosphor-react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import BigNumber from 'bignumber.js';
import { MaxUint256 } from '@ethersproject/constants';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import Txt from '@/components/based/Txt';
import Button from '@/components/based/Button';
import Page from '@/components/based/Page';
import SliderBar from '@/components/based/Slidebar';
import RadioGroup from '@/components/based/RadioGroup';
import InputField from '@/components/based/InputField';
import TradingChart from '@/components/composed/trade/TradingChart';
import TokenField from '@/components/composed/trade/TokenField';
import TabsSwitch from '@/components/composed/trade/TabsSwitch';
import InputFieldMax from '@/components/composed/trade/InputFieldMax';
import InfoItem from '@/components/composed/trade/InfoItem';
import { PriorityType, TokenDetails } from '@/global/types';
import { useOpenPosition } from '@/hooks/useOpenPosition';
import { useQuoter } from '@/hooks/useQuoter';
import { formatAmount, parseAmount } from '@/global/utils';
import { useAllowance, useApprove } from '@/hooks/useToken';
import { STRATEGIES, DEFAULT_DEADLINE, TOKEN_LIST } from '@/global/constants';
import { useVaultData } from '@/hooks/useVault';
import { useMaxLeverage } from '@/hooks/useMaxLeverage';
import { useBorrowInterestRate } from '@/hooks/useBorrowInterestRate';

export default function MarginTradingPage() {
  const { account } = useEthers();

  const [collateralIsSpentToken, setCollateralIsSpentToken] =
    useState<boolean>(true);
  const [spentToken, setSpentToken] = useState<TokenDetails>(TOKEN_LIST[0]);
  const [obtainedToken, setObtainedToken] = useState<TokenDetails>(
    TOKEN_LIST[4]
  );
  const [leverage, setLeverage] = useState<number>(1);
  const [marginAmount, setMarginAmount] = useState<string>('0');
  const [marginMaxPercent, setMarginMaxPercent] = useState<string>('1');
  const [slippagePercent, setSlippagePercent] = useState<string>(
    STRATEGIES.MarginTradingStrategy.defaultSlippage
  );
  const [deadline, setDeadline] = useState<string>(DEFAULT_DEADLINE);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<any>(false);
  const [priority, setPriority] = useState<PriorityType>('buy');

  const collateralToken = collateralIsSpentToken ? spentToken : obtainedToken;

  const leveragedValue = useMemo(() => {
    return parseAmount(marginAmount, collateralToken.decimals).multipliedBy(
      leverage
    );
  }, [leverage, marginAmount, collateralToken]);

  const vaultData = useVaultData(collateralToken.address);
  const tokenBalance = useTokenBalance(collateralToken.address, account);

  const marginAmountValue = useMemo(() => {
    return parseAmount(marginAmount, collateralToken.decimals);
  }, [marginAmount, collateralToken]);

  const minimumMarginValue = useMemo(() => {
    if (!vaultData) return 0;
    return Number(
      formatAmount(
        vaultData?.minimumMargin.toString(),
        collateralToken.decimals,
        false
      )
    );
  }, [collateralToken, vaultData]);

  const quoteValueDst = useQuoter(
    spentToken.address,
    obtainedToken.address,
    leveragedValue,
    STRATEGIES.MarginTradingStrategy
  );

  const quoteValueSrc = useQuoter(
    obtainedToken.address,
    spentToken.address,
    leveragedValue,
    STRATEGIES.MarginTradingStrategy
  );

  const allowance = useAllowance(
    collateralToken.address,
    STRATEGIES.MarginTradingStrategy.address
  );
  const { isLoading: isLoadingApprove, approve } = useApprove(
    collateralToken.address
  );
  const {
    isLoading: isLoadingOpenPos,
    openPosition,
    state,
  } = useOpenPosition(STRATEGIES.MarginTradingStrategy);

  useEffect(() => {
    if (collateralIsSpentToken) {
      setPriority('sell');
    } else {
      setPriority('buy');
    }
  }, [collateralIsSpentToken]);

  const buttonText = useMemo(() => {
    if (!allowance) return 'Open';

    if (new BigNumber(allowance.toString()).isLessThan(marginAmountValue)) {
      return 'Approve';
    }
    return 'Open';
  }, [allowance, collateralToken.decimals, marginAmount]);

  const slippageValue = useMemo(() => {
    if (collateralIsSpentToken) return (100 - Number(slippagePercent)) / 100;
    else return (100 + Number(slippagePercent)) / 100;
  }, [collateralIsSpentToken, slippagePercent]);

  const maxSpent = useMemo(() => {
    if (!quoteValueSrc) return null;
    let _maxSpent;
    if (collateralIsSpentToken) {
      _maxSpent =
        priority === 'sell'
          ? leveragedValue
          : leveragedValue.dividedBy(slippageValue);
    } else {
      _maxSpent =
        priority === 'sell'
          ? quoteValueSrc
          : quoteValueSrc.multipliedBy(slippageValue);
    }
    return _maxSpent;
  }, [
    collateralIsSpentToken,
    priority,
    quoteValueSrc,
    slippageValue,
    leveragedValue,
  ]);

  const minObtained = useMemo(() => {
    let _minObtained;
    if (!quoteValueDst) return null;
    if (collateralIsSpentToken) {
      _minObtained =
        priority === 'sell'
          ? quoteValueDst.multipliedBy(slippageValue)
          : quoteValueDst;
    } else {
      _minObtained =
        priority === 'sell'
          ? leveragedValue.dividedBy(slippageValue)
          : leveragedValue;
    }
    return _minObtained;
  }, [
    collateralIsSpentToken,
    priority,
    leveragedValue,
    slippageValue,
    quoteValueDst,
  ]);

  const borrowed = useMemo(() => {
    if (!maxSpent) return null;
    let _borrowed;
    if (collateralIsSpentToken) {
      _borrowed =
        maxSpent > marginAmountValue
          ? maxSpent.minus(marginAmountValue)
          : BigNumber(0);
    } else _borrowed = maxSpent;
    return _borrowed;
  }, [collateralIsSpentToken, maxSpent, marginAmountValue]);

  const handleChangeToken = () => {
    const tempToken: TokenDetails = spentToken;
    setSpentToken(obtainedToken);
    setObtainedToken(tempToken);
  };

  const handleApprove = () => {
    if (!account || !Number(marginAmount)) return;
    approve(STRATEGIES.MarginTradingStrategy.address, MaxUint256);
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
    if (!minObtained) {
      toast.error('Invalid minObtained!');
      return;
    }
    if (!maxSpent) {
      toast.error('Invalid maxSpent!');
      return;
    }
    if (
      Number(marginAmount) >
      Number(formatUnits(tokenBalance, collateralToken.decimals))
    ) {
      toast.error('Invalid margin amount!');
      return;
    }
    const deadlineTimestamp =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const newOrder = {
      spentToken: spentToken.address,
      obtainedToken: obtainedToken.address,
      collateral: parseAmount(marginAmount, collateralToken.decimals).toFixed(
        0
      ),
      collateralIsSpentToken,
      minObtained: minObtained.toFixed(0),
      maxSpent: maxSpent.toFixed(0),
      deadline: deadlineTimestamp,
    };
    openPosition(newOrder, { gasLimit: 2_000_000 });
  };

  const quoteValueMargin = useQuoter(
    obtainedToken.address,
    spentToken.address,
    marginAmountValue,
    STRATEGIES.MarginTradingStrategy
  );

  const maxLeverage = useMaxLeverage(
    spentToken.address,
    obtainedToken.address,
    marginAmountValue,
    STRATEGIES.MarginTradingStrategy,
    collateralIsSpentToken
      ? marginAmountValue
      : quoteValueMargin || BigNumber(0)
  );

  const borrowIR = useBorrowInterestRate(
    spentToken.address,
    obtainedToken.address,
    marginAmountValue,
    borrowed || BigNumber(0),
    minObtained || BigNumber(0),
    STRATEGIES.MarginTradingStrategy,
    collateralIsSpentToken
  );

  const borrowInterestPercent = useMemo(() => {
    return borrowIR.multipliedBy(leverage - 1).dividedBy(100);
  }, [borrowIR, leverage]);

  const disabledButton = useMemo(() => {
    return borrowInterestPercent.comparedTo(5) === 1;
  }, [borrowInterestPercent]);

  const handleExecute = () => {
    if (
      !marginAmount ||
      Number(marginAmount) <= 0 ||
      Number(marginAmount) < minimumMarginValue
    ) {
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
    if (state.status === 'Success') {
      setMarginAmount('0');
      setLeverage(1);
    }
  }, [state]);

  useEffect(() => {
    setLeverage(1);
  }, [maxLeverage]);

  return (
    <Page
      heading="Margin Trading Strategy"
      description="Go long or short on any token pair"
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
            <TabsSwitch
              activeIndex={collateralIsSpentToken ? 'long' : 'short'}
              onChange={(value: string) => {
                setCollateralIsSpentToken(value === 'long');
                handleChangeToken();
              }}
              items={[
                {
                  title: 'Long',
                  value: 'long',
                },
                {
                  title: 'Short',
                  value: 'short',
                },
              ]}
            />
            <div tw="flex w-full justify-between items-center">
              {collateralIsSpentToken ? (
                <TokenField
                  token={spentToken}
                  noAllow={obtainedToken}
                  onTokenChange={(value) => setSpentToken(value)}
                />
              ) : (
                <TokenField
                  token={obtainedToken}
                  noAllow={spentToken}
                  onTokenChange={(value) => setObtainedToken(value)}
                />
              )}
              <ArrowRight
                size={28}
                tw="text-font-200 mx-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s]"
                onClick={handleChangeToken}
              />
              {collateralIsSpentToken ? (
                <TokenField
                  token={obtainedToken}
                  noAllow={spentToken}
                  onTokenChange={(value) => setObtainedToken(value)}
                />
              ) : (
                <TokenField
                  token={spentToken}
                  noAllow={obtainedToken}
                  onTokenChange={(value) => setSpentToken(value)}
                />
              )}
            </div>
            <InputFieldMax
              label="Margin"
              placeholder="0"
              noMax
              value={marginAmount}
              token={collateralToken}
              stateChanger={setMarginAmount}
              onChange={(value) => {
                setMarginAmount(value);
              }}
              onInput={() => setMarginMaxPercent('1')}
              renderRight={
                <Txt.InputText tw="text-font-100">
                  {collateralToken.symbol}
                </Txt.InputText>
              }
            />
            <TabsSwitch
              activeIndex={marginMaxPercent}
              onChange={(value: string) => {
                setMarginMaxPercent(value);
                if (tokenBalance) {
                  setMarginAmount(
                    Number(
                      formatUnits(
                        tokenBalance.mul(Number(value)).div(100),
                        collateralToken.decimals
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
                tooltipText="The max amount you swap including collateral to get the desired number of tokens"
                label="Max Spent"
                value={
                  maxSpent && !maxSpent.isNaN()
                    ? formatAmount(maxSpent, spentToken.decimals, true, 5)
                    : null
                }
                details={spentToken.symbol}
              />
              <InfoItem
                tooltipText="The lowest you get as a result of the swap"
                label="Min Obtained"
                value={
                  minObtained
                    ? formatAmount(minObtained, obtainedToken.decimals, true, 5)
                    : null
                }
                details={obtainedToken.symbol}
              />
              <InfoItem
                tooltipText="Percentage to be paid as borrowing fees"
                label="Borrow Interest"
                value={
                  !borrowInterestPercent.isNaN()
                    ? `-${borrowInterestPercent.toFixed(2)}%`
                    : null
                }
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
                        <XCircle size={20} tw="text-font-100" />
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
                    <RadioGroup
                      tooltipText="Either spend the exact input (Sell) or obtain the exact output (Buy) amount"
                      label="Priority"
                      items={[
                        {
                          label: 'Buy',
                          value: 'buy',
                        },
                        {
                          label: 'Sell',
                          value: 'sell',
                        },
                      ]}
                      activeRadio={priority}
                      onChange={(value) => setPriority(value as PriorityType)}
                    />
                    <InputField
                      tooltipText="Deadline for the execution time, if the transaction is executed afterwards it will revert"
                      label="Deadline"
                      placeholder="20 mins"
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
        <TradingChart
          firstToken={collateralIsSpentToken ? obtainedToken : spentToken}
          secondToken={collateralToken}
          disableTrading={false}
        />
      </div>
    </Page>
  );
}
