/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

import Txt from '@/components/based/Txt';

interface IDetailItem {
  label: string;
  value: string;
  details?: string;
  valueColor?: 'black' | 'red' | 'green';
}

const DetailItem: FC<IDetailItem> = ({ label, value, details, valueColor }) => {
  return (
    <div tw="flex flex-row justify-between w-full">
      <div tw="flex gap-2 items-center">
        <Txt.Body2Regular tw="text-secondary">{label}</Txt.Body2Regular>
      </div>
      <div tw="flex flex-row gap-2">
        {details && (
          <Txt.Body2Regular tw="text-font-100">{details}</Txt.Body2Regular>
        )}
        {value && (
          <Txt.Body2Bold
            css={[
              tw`text-secondary ml-2`,
              valueColor === 'green' && tw`text-success`,
              valueColor === 'red' && tw`text-error`,
            ]}
          >
            {value}
          </Txt.Body2Bold>
        )}
      </div>
    </div>
  );
};

const PositionDetailsWidget = () => {
  return (
    <div tw="flex flex-col w-full mb-3">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <Txt.Heading2 tw="mb-4">Position details</Txt.Heading2>
        <DetailItem label="Position" value="2.00" details="ETH 2x Long" />
        <DetailItem label="Open price" value="3,129" details="USDC" />
        <DetailItem label="Current price" value="3,129" details="USDC" />
        <DetailItem label="Liq. price" value="3,129" details="USDC" />
        <DetailItem label="Collateral" value="1.00" details="ETH" />
        <DetailItem
          label="Distance from liquidation"
          value="+0.02"
          details="ETH"
        />
        <DetailItem
          label="Profit"
          value="$ +1.240,00 (+15.6%)"
          valueColor="green"
        />
        <DetailItem label="Opened" value="10/01/2021" />
      </div>
    </div>
  );
};

export default PositionDetailsWidget;
