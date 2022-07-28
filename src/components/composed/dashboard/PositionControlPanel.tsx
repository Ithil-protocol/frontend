/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useState } from 'react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';

import { TokenDetails } from '@/global/types';
import Button from '@/components/based/Button';
import SliderBar from '@/components/based/Slidebar';
import TokenInputField from '@/components/composed/trade/TokenInputField';
import TabsSwitch from '@/components/composed/trade/TabsSwitch';
import InfoItem from '@/components/composed/trade/InfoItem';

const PositionControlPanel = () => {
  const { tokens } = TokenList;
  const [controlType, setControlType] = useState<boolean>(false);
  const [token, setToken] = useState<TokenDetails>(tokens[0]);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const [buttonText, setButtonText] = useState('Top up');

  return (
    <div tw="flex flex-col w-full mb-8">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 mb-3">
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
      </div>
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 mb-3">
        <InfoItem label="Liquidation price" value="3000 ETH/USDC" />
        <TabsSwitch
          activeIndex={controlType ? 'topup' : 'withdraw'}
          onChange={(value: string) => setControlType(value === 'topup')}
          items={[
            {
              title: 'Top up',
              value: 'topup',
            },
            {
              title: 'Withdraw',
              value: 'withdraw',
            },
          ]}
        />
        <TokenInputField
          label="Top up"
          availableTokens={tokens}
          value={tokenInputValue}
          setValue={setTokenInputValue}
          token={token}
          onTokenChange={(value) => setToken(value)}
        />
        <Button text={buttonText} full action bold />
      </div>
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <InfoItem label="Position Value" value="3000 USDC" />
        <Button text="Close position" full action bold secondary />
      </div>
    </div>
  );
};

export default PositionControlPanel;
