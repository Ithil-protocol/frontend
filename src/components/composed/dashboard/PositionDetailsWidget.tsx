/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

import Txt from '@/components/based/Txt';
import { formatAmount } from '@/global/utils';
import { StrategyContractType } from '@/global/types';
import usePositionDetails from '@/hooks/usePositionDetails';

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

interface IPositionDetailsWidget {
  details: any;
  strategy: StrategyContractType;
}

const PositionDetailsWidget: FC<IPositionDetailsWidget> = ({
  details,
  strategy,
}) => {
  const {
    leverageValue,
    positionValue,
    openPriceValue,
    tokenPairValue,
    currentPriceValue,
    liqPriceValue,
    collateralToken,
    distFromLiquidation,
    pnlText,
    pnlValue,
    createdAtValue,
  } = usePositionDetails(details, strategy);

  return (
    <div tw="flex flex-col w-full mb-3">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <Txt.Heading2 tw="mb-4">Position details</Txt.Heading2>

        <DetailItem label="Type" value={positionValue} />
        <DetailItem
          label="Profit"
          value={pnlText}
          valueColor={pnlValue.isLessThan(0) ? 'red' : 'green'}
        />
        <DetailItem label="Opened" value={createdAtValue} />
        <DetailItem
          label="Collateral"
          value={formatAmount(
            details.collateral.toString(),
            collateralToken?.decimals
          )}
          details={collateralToken?.symbol}
        />
        {openPriceValue && (
          <DetailItem
            label="Open price"
            value={openPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        {currentPriceValue && (
          <DetailItem
            label="Current price"
            value={currentPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        {liqPriceValue && (
          <DetailItem
            label="Liq. price"
            value={liqPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        {distFromLiquidation && (
          <DetailItem
            label="Distance from liquidation"
            value={`${distFromLiquidation.toFixed(2)}%`}
          />
        )}
      </div>
    </div>
  );
};

export default PositionDetailsWidget;
