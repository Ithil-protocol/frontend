/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useState } from 'react';
import { FixedNumber } from 'ethers';
import { ArrowRight, FadersHorizontal, XCircle } from 'phosphor-react';
import TokenList from '@ithil-protocol/deployed/latest/tokenlist.json';
// import { addresses } from '@ithil-protocol/deployed/latest/addresses.json';
import { useEthers } from '@usedapp/core';

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
import { Priority, TokenDetails } from '@/global/types';

export default function MarginTradingPage() {
  const { tokens } = TokenList;

  const [positionType, setPositionType] = useState<'short' | 'long'>('long');
  const [spentToken, setSpentToken] = useState<TokenDetails>(tokens[0]);
  const [obtainedToken, setObtainedToken] = useState<TokenDetails>(tokens[1]);
  const [leverage, setLeverage] = useState<number>(1);
  const [margin, setMargin] = useState<string>('2');
  const [slippage, setSlippage] = useState<any>(1);
  const [deadline, setDeadline] = useState<any>(20);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<any>(false);
  const [priority, setPriority] = useState<Priority>('buy');
  const [isLoading, setisLoading] = useState(false);
  const [Status, setStatus] = useState('');
  const [buttonText, setButtonText] = useState<string>('Approve');

  const [minObtained, setMinObtained] = useState<FixedNumber>(
    FixedNumber.from('0')
  );
  const [maxLeverage, setMaxLeverage] = useState<FixedNumber>(
    FixedNumber.from('5')
  );
  const [maxSpent, setMaxSpent] = useState<FixedNumber>(FixedNumber.from('0'));

  const { account } = useEthers();

  const [, setOpenPositionHash] = useState<string | undefined>(undefined);

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
                  activeIndex={positionType}
                  onChange={(value: any) => setPositionType(value)}
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
                    onTokenChange={(value) => setSpentToken(value)}
                  />
                  <ArrowRight size={28} tw="text-font-200 mx-6" />
                  <TokenField
                    token={obtainedToken}
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
                    value={minObtained.round(4).toString()}
                  />
                  <InfoItem
                    tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                    label="Max. spent"
                    value={maxSpent.round(4).toString()}
                  />
                </div>
                <InputFieldMax
                  label="Margin"
                  placeholder="0"
                  unit={spentToken.symbol}
                  address={spentToken.address}
                  value={margin.toString()}
                  stateChanger={setMargin}
                  onChange={(value) => {
                    setMargin(value);
                    setButtonText('');
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
                  max={Number(maxLeverage.toString())}
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
                          value={slippage}
                          onChange={(value) => setSlippage(value)}
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
                          onChange={(value) => setPriority(value as Priority)}
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
                  text={buttonText}
                  full
                  action
                  bold
                  isLoading={isLoading}
                />
                <Txt.CaptionMedium>{Status}</Txt.CaptionMedium>
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
