/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import Txt from '@/components/based/Txt';
import { formatAmount } from '@/global/utils';
import { OpenedPositionType, StrategyContractType } from '@/global/types';
import usePositionDetails from '@/hooks/usePositionDetails';

interface IDetailItem {
  label: string;
  value: string | null;
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
        {value === null ? (
          <div tw="w-10">
            <Skeleton height={18} />
          </div>
        ) : (
          value && (
            <Txt.Body2Bold
              css={[
                tw`ml-2 text-secondary`,
                valueColor === 'green' && tw`text-success`,
                valueColor === 'red' && tw`text-error`,
              ]}
            >
              {value}
            </Txt.Body2Bold>
          )
        )}
      </div>
    </div>
  );
};

export const SkeletonPositionDetailsWidget = () => {
  return (
    <div tw="flex flex-col w-full mb-3">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <Txt.Heading2 tw="mb-4">Position details</Txt.Heading2>

        <DetailItem label="Type" value={null} />
        <DetailItem label="Profit" value={null} />
        <DetailItem label="Opened" value={null} />
        <DetailItem label="Collateral" value={null} />
        <DetailItem label="Obtained" value={null} />
        <DetailItem label="Open price" value={null} />
        <DetailItem label="Current price" value={null} />
        <DetailItem label="Liq. price" value={null} />
        <DetailItem label="Distance from liquidation" value={null} />
      </div>
    </div>
  );
};

interface IPositionDetailsWidget {
  details: OpenedPositionType;
  strategy: StrategyContractType;
}

const PositionDetailsWidget: FC<IPositionDetailsWidget> = ({
  details,
  strategy,
}) => {
  const {
    positionValue,
    openPriceValue,
    tokenPairValue,
    currentPriceValue,
    liqPriceValue,
    collateralToken,
    distFromLiquidation,
    allowanceValue,
    pnlText,
    heldToken,
    owedToken,
    principalValue,
    pnlValue,
    createdAtValue,
    interestRateValue
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
        {/* <DetailItem
          label="Obtained"
          value={
            quoteValue && currentPriceValue
              ? formatAmount(
                  quoteValue.dividedBy(currentPriceValue),
                  heldToken?.decimals
                )
              : null
          }
          details={heldToken?.symbol}
        /> */}
        <DetailItem
          label="Allowance"
          value={
            !allowanceValue.isNaN()
              ? formatAmount(allowanceValue, heldToken?.decimals)
              : null
          }
          details={heldToken?.symbol}
        />
        <DetailItem
          label="Principal"
          value={
            !principalValue.isNaN()
              ? formatAmount(principalValue, owedToken?.decimals)
              : null
          }
          details={owedToken?.symbol}
        />
        <DetailItem
          label="Daily interest rate"
          value={interestRateValue ? formatAmount(interestRateValue,2) + "%" : null}
        />
        <DetailItem
          label="Open price"
          value={openPriceValue ? openPriceValue.toFixed(4) : null}
          details={tokenPairValue}
        />
        <DetailItem
          label="Current price"
          value={currentPriceValue ? currentPriceValue.toFixed(4) : null}
          details={tokenPairValue}
        />
        <DetailItem
          label="Liq. price"
          value={liqPriceValue ? liqPriceValue.toFixed(4) : null}
          details={tokenPairValue}
        />
        <DetailItem
          label="Distance from liquidation"
          value={
            distFromLiquidation ? `${distFromLiquidation.toFixed(2)}%` : null
          }
        />
      </div>
    </div>
  );
};

export default PositionDetailsWidget;
