/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
<<<<<<< HEAD
import React, { FC, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import Txt from '@/components/based/Txt';
import { formatAmount, getTokenByAddress } from '@/global/utils';
import {
  useComputePairRiskFactor,
  useQuote,
} from '@/hooks/useMarginTradingStrategy';
=======
import React, { FC } from 'react';

import Txt from '@/components/based/Txt';
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)

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

<<<<<<< HEAD
interface IPositionDetailsWidget {
  details: any;
}

const PositionDetailsWidget: FC<IPositionDetailsWidget> = ({ details }) => {
  const principalValue = useMemo(
    () => new BigNumber(details.principal.toString()),
    [details]
  );
  const collateralValue = useMemo(
    () => new BigNumber(details.collateral.toString()),
    [details]
  );
  const allowanceValue = useMemo(
    () => new BigNumber(details.allowance.toString()),
    [details]
  );
  const owedToken = useMemo(
    () => getTokenByAddress(details.owedToken),
    [details]
  );
  const heldToken = useMemo(
    () => getTokenByAddress(details.heldToken),
    [details]
  );
  const collateralToken = useMemo(
    () => getTokenByAddress(details.collateralToken),
    [details]
  );

  const longShortValue = useMemo(() => {
    return details.collateralToken === details.owedToken ? 'Long' : 'Short';
  }, [details]);

  const leverageValue = useMemo(() => {
    return longShortValue === 'Long'
      ? principalValue.plus(collateralValue).dividedBy(collateralValue)
      : allowanceValue.dividedBy(collateralValue);
  }, [allowanceValue, collateralValue, longShortValue, principalValue]);

  const tokenPairValue = useMemo(() => {
    return longShortValue === 'Long'
      ? `${collateralToken?.symbol}/${heldToken?.symbol}`
      : `${collateralToken?.symbol}/${owedToken?.symbol}`;
  }, [longShortValue, collateralToken, heldToken, owedToken]);

  const openPriceValue = useMemo(() => {
    return longShortValue === 'Long'
      ? principalValue.plus(collateralValue).dividedBy(allowanceValue)
      : allowanceValue.minus(collateralValue).dividedBy(principalValue);
  }, [allowanceValue, collateralValue, longShortValue, principalValue]);

  const positionValue = useMemo(() => {
    return `${tokenPairValue} ${leverageValue.toFixed(2)}x ${longShortValue}`;
  }, [tokenPairValue, leverageValue, longShortValue]);

  const currentPrice = useQuote(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    new BigNumber(1)
  );

  const riskFactor = useComputePairRiskFactor(
    details.owedToken,
    details.heldToken
  );

  const liqPriceValue = useMemo(() => {
    return collateralValue
      .multipliedBy(riskFactor)
      .multipliedBy(longShortValue === 'Long' ? 1 : -1)
      .plus(principalValue)
      .dividedBy(allowanceValue);
  }, [
    allowanceValue,
    collateralValue,
    longShortValue,
    principalValue,
    riskFactor,
  ]);

  const distFromLiquidation = useMemo(() => {
    return longShortValue === 'Long'
      ? currentPrice.dividedBy(liqPriceValue).minus(1).multipliedBy(100)
      : liqPriceValue.dividedBy(currentPrice).minus(1).multipliedBy(100);
  }, [currentPrice, liqPriceValue, longShortValue]);

  const feesValue = useMemo(() => {
    const _feesValue = new BigNumber(details.fees.toString());
    const interestRateValue = new BigNumber(details.interestRate.toString());
    const timestamp = new BigNumber(Math.floor(new Date().getTime() / 1000));
    const createdAtValue = new BigNumber(details.createdAt.toString());
    return interestRateValue
      .multipliedBy(timestamp.minus(createdAtValue))
      .multipliedBy(principalValue)
      .dividedBy(864000000)
      .plus(_feesValue);
  }, [details, principalValue]);

  // console.log(formatAmount(feesValue, collateralToken?.decimals));
  const quoteValue = useQuote(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue)
  );

  const pnlValue = useMemo(() => {
    return longShortValue === 'Long'
      ? quoteValue.minus(principalValue).minus(collateralValue).minus(feesValue)
      : allowanceValue.minus(quoteValue).minus(collateralValue);
  }, [
    allowanceValue,
    collateralValue,
    feesValue,
    longShortValue,
    principalValue,
    quoteValue,
  ]);

  const pnlText = useMemo(() => {
    return `${collateralToken?.symbol} ${
      pnlValue.isLessThan(0) ? '' : '+'
    }${formatAmount(pnlValue, collateralToken?.decimals)} (${pnlValue
      .multipliedBy(100)
      .dividedBy(collateralValue)
      .toFixed(2)}%)`;
  }, [collateralToken, collateralValue, pnlValue]);

  const createdAtValue = useMemo(() => {
    return new Date(
      Number(details.createdAt.toString()) * 1000
    ).toLocaleDateString();
  }, [details]);

=======
const PositionDetailsWidget = () => {
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)
  return (
    <div tw="flex flex-col w-full mb-3">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <Txt.Heading2 tw="mb-4">Position details</Txt.Heading2>
<<<<<<< HEAD

        <DetailItem
          label="Position"
          value={leverageValue.toFixed(2)}
          details={positionValue}
        />
        <DetailItem
          label="Open price"
          value={openPriceValue.toFixed(2)}
          details={tokenPairValue}
        />
        <DetailItem
          label="Current price"
          value={currentPrice.toFixed(2)}
          details={tokenPairValue}
        />
        <DetailItem
          label="Liq. price"
          value={liqPriceValue.toFixed(2)}
          details={tokenPairValue}
        />
        <DetailItem
          label="Collateral"
          value={formatAmount(
            details.collateral.toString(),
            collateralToken?.decimals
          )}
          details={tokenPairValue.split('/')[0]}
        />
        <DetailItem
          label="Distance from liquidation"
          value={`${distFromLiquidation.toFixed(2)}%`}
        />
        <DetailItem
          label="Profit"
          value={pnlText}
          valueColor={pnlValue.isLessThan(0) ? 'red' : 'green'}
        />
        <DetailItem label="Opened" value={createdAtValue} />
=======
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
>>>>>>> c78b5e6 (feat: add dashboard and position details UI)
      </div>
    </div>
  );
};

export default PositionDetailsWidget;
