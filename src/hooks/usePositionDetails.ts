import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { BigNumber as BN } from '@ethersproject/bignumber';

import { useQuoter } from './useQuoter';
import { useComputePairRiskFactor } from './useComputePairRiskFactor';

import { OpenedPositionType, StrategyContractType } from '@/global/types';
import { formatAmount, getTokenByAddress, parseAmount } from '@/global/utils';

export default function usePositionDetails(
  details: OpenedPositionType,
  strategy: StrategyContractType
) {
  const principalValue = useMemo(
    () => new BigNumber(BN.from(details.principal).toString()),
    [details]
  );
  const collateralValue = useMemo(
    () => new BigNumber(BN.from(details.collateral).toString()),
    [details]
  );
  const allowanceValue = useMemo(
    () => new BigNumber(BN.from(details.allowance).toString()),
    [details]
  );
  const owedToken = useMemo(
    () => getTokenByAddress(details.owedToken),
    [details]
  );
  const heldToken = useMemo(
    () =>
      getTokenByAddress(details.heldToken) ||
      (owedToken && {
        name: `Yearn ${owedToken.name}`,
        address: details.heldToken,
        symbol: `y${owedToken.symbol}`,
        decimals: owedToken.decimals,
        logoURI: owedToken.logoURI,
      }),
    [details.heldToken, owedToken]
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
      : allowanceValue.minus(collateralValue).dividedBy(collateralValue);
  }, [longShortValue, principalValue, collateralValue, allowanceValue]);

  const tokenPairValue = useMemo(() => {
    return longShortValue === 'Long'
      ? `${heldToken?.symbol}/${collateralToken?.symbol}`
      : `${owedToken?.symbol}/${collateralToken?.symbol}`;
  }, [longShortValue, collateralToken, heldToken, owedToken]);

  const openPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    const _priceValue =
      longShortValue === 'Long'
        ? principalValue.plus(collateralValue).dividedBy(allowanceValue)
        : allowanceValue.minus(collateralValue).dividedBy(principalValue);
    return _priceValue.multipliedBy(
      new BigNumber(10).pow(heldToken.decimals - owedToken.decimals)
    );
  }, [
    allowanceValue,
    collateralValue,
    heldToken,
    longShortValue,
    owedToken,
    principalValue,
  ]);

  const positionValue = useMemo(() => {
    return `${strategy.label} ${
      strategy.type === 'margin' ? `${longShortValue}` : ''
    }`;
  }, [strategy, longShortValue, tokenPairValue]);

  const currentPrice = useQuoter(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue,
    strategy
  );

  const currentPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    return currentPrice
      .dividedBy(longShortValue === 'Long' ? allowanceValue : principalValue)
      .multipliedBy(
        new BigNumber(10).pow(heldToken.decimals - owedToken.decimals)
      );
  }, [currentPrice, heldToken, owedToken]);

  const riskFactor = useComputePairRiskFactor(
    details.owedToken,
    details.heldToken,
    strategy
  );

  const liqPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    if (longShortValue === 'Long')
      return collateralValue
        .multipliedBy(riskFactor)
        .dividedBy(10000)
        .plus(principalValue)
        .multipliedBy(new BigNumber(10).pow(heldToken.decimals))
        .dividedBy(
          allowanceValue.multipliedBy(new BigNumber(10).pow(owedToken.decimals))
        );
    else
      return allowanceValue
        .minus(collateralValue.multipliedBy(riskFactor).dividedBy(10000))
        .multipliedBy(new BigNumber(10).pow(owedToken.decimals))
        .dividedBy(
          principalValue.multipliedBy(new BigNumber(10).pow(heldToken.decimals))
        );
  }, [
    allowanceValue,
    collateralValue,
    heldToken,
    longShortValue,
    owedToken,
    principalValue,
    riskFactor,
  ]);

  const distFromLiquidation = useMemo(() => {
    if (!liqPriceValue || !currentPriceValue) return undefined;
    return longShortValue === 'Long'
      ? currentPriceValue.dividedBy(liqPriceValue).minus(1).multipliedBy(100)
      : liqPriceValue.dividedBy(currentPriceValue).minus(1).multipliedBy(100);
  }, [currentPriceValue, liqPriceValue, longShortValue]);

  const feesValue = useMemo(() => {
    const _feesValue = new BigNumber(BN.from(details.fees).toString());
    const interestRateValue = new BigNumber(
      BN.from(details.interestRate).toString()
    );
    const createdAtValue = new BigNumber(BN.from(details.createdAt).toString());

    const now = new BigNumber(Math.floor(new Date().getTime() / 1000));
    return interestRateValue
      .multipliedBy(now.minus(createdAtValue))
      .multipliedBy(principalValue)
      .dividedBy(864000000)
      .plus(_feesValue);
  }, [details, principalValue]);

  // console.log(formatAmount(feesValue, collateralToken?.decimals));
  const quoteValue = useQuoter(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue),
    strategy
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
      !pnlValue.isGreaterThan(0) ? '' : '+'
    }${formatAmount(pnlValue, collateralToken?.decimals)} (${pnlValue
      .multipliedBy(100)
      .dividedBy(collateralValue)
      .toFixed(2)}%)`;
  }, [collateralToken, collateralValue, pnlValue]);

  const createdAtValue = useMemo(() => {
    return new Date(
      Number(BN.from(details.createdAt).toString()) * 1000
    ).toLocaleString();
  }, [details]);

  return {
    longShortValue,
    leverageValue,
    positionValue,
    openPriceValue,
    tokenPairValue,
    allowanceValue,
    principalValue,
    currentPriceValue,
    liqPriceValue,
    collateralToken,
    collateralValue,
    heldToken,
    owedToken,
    distFromLiquidation,
    pnlText,
    pnlValue,
    createdAtValue,
    feesValue,
    quoteValue,
  };
}
