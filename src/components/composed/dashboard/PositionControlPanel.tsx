/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useState } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { formatUnits, parseUnits } from '@ethersproject/units';

import TabsSwitch from '../trade/TabsSwitch';
import InputFieldMax from '../trade/InputFieldMax';

import { StrategyContractType, TokenDetails } from '@/global/types';
import Button from '@/components/based/Button';
// import SliderBar from '@/components/based/Slidebar';
import { useEditPosition } from '@/hooks/useEditPosition';
import Txt from '@/components/based/Txt';
// import TabsSwitch from '@/components/composed/trade/TabsSwitch';

interface IPositionControlPanel {
  onClosePosition: () => void;
  positionId: string;
  token: TokenDetails;
  strategy: StrategyContractType;
}

const PositionControlPanel: FC<IPositionControlPanel> = ({
  positionId,
  strategy,
  token,
  onClosePosition,
}) => {
  // const [controlType, setControlType] = useState<boolean>(false);
  const { account } = useEthers();
  const [topupMaxPercent, setTopupMaxPercent] = useState<string>('1');
  const tokenBalance = useTokenBalance(token.address, account);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const { editPosition, isLoading } = useEditPosition(strategy);

  const handleTopup = () => {
    editPosition(positionId, parseUnits(tokenInputValue, token.decimals), {
      gasLimit: 2_000_000,
    });
  };

  return (
    <div tw="flex flex-col w-full mb-8">
      {/* <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 mb-3">
        <div tw="-mb-6 w-full">
          <InfoItem
            label="Collateral"
            value="101.6%"
            tooltipText="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
          />
        </div>
        <SliderBar
          min={50}
          max={150}
          step={0.1}
          value={100}
          onChange={(value) => console.log(value)}
          marks={{ 50: 'Withdraw', 150: 'Topup' }}
        />
      </div> */}
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 mb-3">
        <InputFieldMax
          label="Margin"
          placeholder="0"
          noMax
          value={tokenInputValue}
          token={token}
          stateChanger={setTokenInputValue}
          onChange={(value) => {
            setTokenInputValue(value);
          }}
          onInput={() => setTopupMaxPercent('1')}
          renderRight={
            <Txt.InputText tw="text-font-100">{token.symbol}</Txt.InputText>
          }
        />
        <TabsSwitch
          activeIndex={topupMaxPercent}
          onChange={(value: string) => {
            setTopupMaxPercent(value);
            if (tokenBalance) {
              setTokenInputValue(
                Number(
                  formatUnits(
                    tokenBalance.mul(Number(value)).div(100),
                    token.decimals
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
        />
        <Button
          text="Top up"
          full
          action
          bold
          onClick={handleTopup}
          isLoading={isLoading}
        />
      </div>
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        {/* <InfoItem label="Position Value" value="3000 USDC" /> */}
        <Button
          text="Close position"
          full
          action
          bold
          secondary
          onClick={onClosePosition}
        />
      </div>
    </div>
  );
};

export default PositionControlPanel;
