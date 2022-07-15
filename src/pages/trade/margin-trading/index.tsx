/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useMemo, useState } from 'react';
import { ArrowRight, FadersHorizontal, XCircle } from 'phosphor-react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';
// import { addresses } from '@ithil-protocol/deployed/latest/addresses.json';
import { useEthers } from '@usedapp/core';
import BigNumber from 'bignumber.js';
import { MaxUint256 } from '@ethersproject/constants';

import Txt from '@/components/based/Txt';
import Button from '@/components/based/Button';
import Container from '@/components/based/Container';
import SliderBar from '@/components/based/Slidebar';
import RadioGroup from '@/components/based/RadioGroup';
import InputField from '@/components/based/InputField';
import ChartCard from '@/components/composed/trade/ChartCard';
import TokenField from '@/components/composed/trade/TokenField';
import TabsSwitch from '@/components/composed/trade/TabsSwitch';
import InputFieldMax from '@/components/composed/trade/InputFieldMax';
import InfoItem from '@/components/composed/trade/InfoItem';
import AdvancedSectionImg from '@/assets/images/advancedSectionImage.png';
import { OrderType, PriorityType, TokenDetails } from '@/global/types';
import { GOERLI_ADDRESSES, MAX_LEVERAGE } from '@/global/constants';
import { useOpenPosition, useQuote } from '@/hooks/useMarginTradingStrategy';
import { formatAmount, parseAmount } from '@/global/utils';
import { useAllowance, useApprove } from '@/hooks/useERC20';

export default function MarginTradingPage() {
  const { tokens } = TokenList;
  const { account } = useEthers();

  const [collateralIsSpentToken, setCollateralIsSpentToken] =
    useState<boolean>(true);
  const [spentToken, setSpentToken] = useState<TokenDetails>(tokens[0]);
  const [obtainedToken, setObtainedToken] = useState<TokenDetails>(tokens[1]);
  const [leverage, setLeverage] = useState<number>(1);
  const [marginAmount, setMarginAmount] = useState<string>('2');
  const [slippagePercent, setSlippagePercent] = useState<string>('1');
  const [deadline, setDeadline] = useState<string>('20');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<any>(false);
  const [priority, setPriority] = useState<PriorityType>('buy');

  const leveragedValue = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals).multipliedBy(
      leverage
    );
  }, [leverage, marginAmount, spentToken]);

  const quoteValue = useQuote(
    spentToken.address,
    obtainedToken.address,
    leveragedValue
  );
  const allowance = useAllowance(
    spentToken.address,
    GOERLI_ADDRESSES.MarginTradingStrategy
  );
  const { isLoading: isLoadingApprove, approve } = useApprove(
    spentToken.address
  );
  const {
    isLoading: isLoadingOpenPos,
    openPosition,
    estimateGas,
  } = useOpenPosition();

  const buttonText = useMemo(() => {
    if (!allowance) return 'Open';
    const marginedAmountValue = parseAmount(marginAmount, spentToken.decimals);

    if (new BigNumber(allowance.toString()).isLessThan(marginedAmountValue)) {
      return 'Approve';
    }
    return 'Open';
  }, [allowance, marginAmount, spentToken.decimals]);

  const maxSpent = useMemo(() => {
    return collateralIsSpentToken ? leveragedValue.toFixed() : quoteValue;
  }, [collateralIsSpentToken, leveragedValue, quoteValue]);

  const minObtained = useMemo(() => {
    const slippageValue = (100 - Number(slippagePercent)) / 100;
    return leveragedValue.multipliedBy(slippageValue).toFixed();
  }, [leveragedValue, slippagePercent]);

  const handleChangeToken = () => {
    const tempToken: TokenDetails = spentToken;
    setSpentToken(obtainedToken);
    setObtainedToken(tempToken);
  };

  const handleApprove = () => {
    if (!account || !Number(marginAmount)) return;
    approve(GOERLI_ADDRESSES.MarginTradingStrategy, MaxUint256);
  };

  const handleOpenOrder = async () => {
    if (!account) return;
    const deadlineTimestamp =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);
    const newOrder = {
      spentToken: spentToken.address,
      obtainedToken: obtainedToken.address,
      collateral: parseAmount(marginAmount, spentToken.decimals).toString(),
      collateralIsSpentToken,
      minObtained,
      maxSpent: maxSpent.toString(),
      deadline: deadlineTimestamp,
    };

    // const gas = await estimateGas(newOrder);
    openPosition(newOrder);
  };

  const handleExecute = () => {
    if (buttonText === 'Approve') {
      handleApprove();
    } else {
      handleOpenOrder();
    }
  };

  const sliderMarks = useMemo(() => {
    const marks: { [key: number]: string } = {};
    for (let i = 1; i <= MAX_LEVERAGE; i++) {
      marks[i] = `${i}x`;
    }
    return marks;
  }, []);

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full tablet:w-9/12 desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12">Margin Trading Strategy </Txt.Heading1>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <link
              href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
              rel="stylesheet"
            />

            <div tw="flex flex-col gap-3 flex-grow w-full desktop:w-4/12">
              <div tw="flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7">
                <TabsSwitch
                  activeIndex={collateralIsSpentToken ? 'long' : 'short'}
                  onChange={(value: string) =>
                    setCollateralIsSpentToken(value === 'long')
                  }
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
                  <TokenField
                    token={spentToken}
                    noAllow={obtainedToken}
                    onTokenChange={(value) => setSpentToken(value)}
                  />
                  <ArrowRight
                    size={28}
                    tw="text-font-200 mx-6 cursor-pointer hover:transform[scale(1.1)] transition-all transition-duration[.2s]"
                    onClick={handleChangeToken}
                  />
                  <TokenField
                    token={obtainedToken}
                    noAllow={spentToken}
                    onTokenChange={(value) => setObtainedToken(value)}
                  />
                </div>
                <div tw="w-full">
                  <InfoItem
                    tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                    label="Leverage"
                    value={`${leverage}x`}
                  />
                  <InfoItem
                    tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                    label="Min. obtained"
                    value={formatAmount(minObtained, spentToken.decimals)}
                  />
                  <InfoItem
                    tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                    label="Max. spent"
                    value={
                      maxSpent
                        ? formatAmount(maxSpent, spentToken.decimals)
                        : '-'
                    }
                  />
                </div>
                <InputFieldMax
                  label="Margin"
                  placeholder="0"
                  value={marginAmount}
                  token={spentToken}
                  stateChanger={setMarginAmount}
                  onChange={(value) => {
                    setMarginAmount(value);
                  }}
                  renderRight={
                    <Txt.InputText tw="text-font-100">
                      {spentToken.symbol}
                    </Txt.InputText>
                  }
                />
                <SliderBar
                  label="Leverage"
                  tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                  min={1}
                  max={MAX_LEVERAGE}
                  step={0.2}
                  value={leverage}
                  onChange={(value) => setLeverage(value as number)}
                  marks={sliderMarks}
                />
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
                      <img
                        tw="w-full my-5"
                        src={AdvancedSectionImg}
                        alt="advancedSectionPlaceholder"
                      />
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
                        <RadioGroup
                          tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
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
                          onChange={(value) =>
                            setPriority(value as PriorityType)
                          }
                        />
                        <InputField
                          tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                          label="Deadline"
                          placeholder="20 mins"
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
                  text={buttonText}
                  full
                  action
                  bold
                  disabled={!allowance}
                  onClick={handleExecute}
                  isLoading={isLoadingApprove || isLoadingOpenPos}
                />
                {/* <Txt.CaptionMedium>{Status}</Txt.CaptionMedium> */}
              </div>
            </div>
            <ChartCard
              firstToken={obtainedToken}
              secondToken={spentToken}
              disableTrading={false}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
