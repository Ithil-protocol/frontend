/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useEffect, useState } from 'react';
import { FadersHorizontal } from 'phosphor-react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';

import { TokenDetails } from '@/global/types';
import Txt from '@/components/based/Txt';
import SliderBar from '@/components/based/Slidebar';
import InputField from '@/components/based/InputField';
import Container from '@/components/based/Container';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import TabsSwitch from '@/components/composed/trade/TabsSwitch';
import TokenInputField from '@/components/composed/trade/TokenInputField';
import { ReactComponent as YearnLogo } from '@/assets/images/yearn.svg';
import { ReactComponent as LidoLogo } from '@/assets/images/lido.svg';

export default function LeveragedStakingPage() {
  const { tokens } = TokenList;
  const [positionProtocol, setPositionProtocol] = useState<'yearn' | 'lido'>(
    'yearn'
  );
  const [token, setToken] = useState<TokenDetails>(tokens[0]);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [availableTokens, setAvailableTokens] = useState(tokens);
  const [leverage, setLeverage] = useState<number>(1);
  const [slippage, setSlippage] = useState<any>(1);
  const [deadline, setDeadline] = useState<any>(20);
  const [maxSpent, setMaxSpent] = useState<any>(0);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState<any>(false);

  const [maxLeverage, setMaxLeverage] = useState<any>(0);

  useEffect(() => {
    const newTokens =
      positionProtocol === 'lido'
        ? tokens.filter((f) => f.symbol === 'WETH')
        : tokens;
    setAvailableTokens(newTokens);
    setToken(newTokens[0]);
  }, [positionProtocol]);

  const [openPositionHash, setOpenPositionHash] = useState<string | undefined>(
    undefined
  );

  return (
    <Container>
      <div tw="flex flex-col w-full items-center">
        <div tw="w-full tablet:w-9/12 desktop:w-10/12 flex flex-col items-center">
          <Txt.Heading1 tw="mb-12">Leveraged staking </Txt.Heading1>
          <div tw="w-full flex flex-col desktop:flex-row gap-6">
            <div tw="flex flex-col gap-3 flex-grow w-full desktop:w-4/12">
              <div tw="flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7">
                <TabsSwitch
                  activeIndex={positionProtocol}
                  onChange={(value: any) => setPositionProtocol(value)}
                  items={[
                    {
                      title: 'YFI',
                      icon: YearnLogo,
                      value: 'yearn',
                    },
                    {
                      title: 'CRV',
                      icon: LidoLogo,
                      value: 'lido',
                    },
                  ]}
                />
                <div tw="flex w-full justify-between items-center">
                  <TokenInputField
                    label="Margin"
                    availableTokens={availableTokens}
                    value={tokenInput}
                    setValue={setTokenInput}
                    token={token}
                    onTokenChange={(value) => setToken(value)}
                  />
                </div>
                <div tw="w-full">
                  <InfoItem
                    tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                    label="Max. spent"
                    value={0}
                  />
                </div>

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
                            <FadersHorizontal size={20} tw="text-font-100" />
                          </button>{' '}
                        </div>
                      </div>

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
                <Button text="1 TKN" full action bold />
              </div>
            </div>
            <div tw="w-full height[500px] tablet:height[500px] desktop:height[700px] desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100">
              Yearn Chart
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
