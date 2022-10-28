/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

import Txt from '@/components/based/Txt';
import { TOKEN_LIST } from '@/global/ithil';
import { useChainId } from '@/hooks';

interface IText {
  value: string;
}

export const Text: FC<IText> = ({ value }) => {
  return <Txt.Body2Regular tw="text-secondary">{value}</Txt.Body2Regular>;
};

interface ITokenPair {
  collateralTokenSymbol: string;
  investmentTokenSymbol: string;
  noText?: boolean;
}

export const TokenPair: FC<ITokenPair> = ({
  collateralTokenSymbol,
  investmentTokenSymbol,
  noText = false,
}) => {
  const chainId = useChainId();
  const collateralTokenLogoURI = TOKEN_LIST[chainId]?.filter(
    (token) => token.symbol === collateralTokenSymbol
  )[0]?.logoURI;

  const investmentTokenLogoURI = TOKEN_LIST[chainId]?.filter(
    (token) => token.symbol === investmentTokenSymbol
  )[0]?.logoURI;

  return (
    <div
      css={[
        tw`inline-block -ml-3.5`,
        !noText && tw`flex flex-row justify-start items-center gap-6`,
      ]}
    >
      <div tw="relative">
        <div tw="w-7 h-7 border-radius[100%] bg-primary-100 absolute bottom[-2px] left[18px] z-index[2]"></div>
        {investmentTokenLogoURI ? (
          <img
            tw="w-6 h-6 z-index[3]"
            src={investmentTokenLogoURI}
            alt={investmentTokenSymbol}
          />
        ) : (
          <div tw="w-6 h-6 bg-primary-400 rounded-full z-index[3] flex items-center justify-center">
            <Txt.Body2Bold>?</Txt.Body2Bold>
          </div>
        )}
        {collateralTokenLogoURI ? (
          <img
            tw="w-6 h-6 left-5 bottom-0 absolute z-index[4]"
            src={collateralTokenLogoURI}
            alt={collateralTokenSymbol}
          />
        ) : (
          <div tw="w-6 h-6 bg-primary-400 rounded-full left-5 bottom-0 absolute z-index[4] flex items-center justify-center">
            <Txt.Body2Bold>?</Txt.Body2Bold>
          </div>
        )}
      </div>
      {!noText && (
        <Text value={`${investmentTokenSymbol}/${collateralTokenSymbol}`} />
      )}
    </div>
  );
};

interface IPositionProfit {
  currencyValue: number;
  percentageValue: number;
}

export const PositionProfit: FC<IPositionProfit> = ({
  currencyValue,
  percentageValue,
}) => {
  const currency = currencyValue
    ? new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
        signDisplay: 'always',
      }).format(currencyValue)
    : '';
  const percentage = percentageValue
    ? new Intl.NumberFormat('en-us', {
        style: 'percent',
        signDisplay: 'always',
      }).format(percentageValue)
    : '';

  return (
    <Txt.Body2Regular
      css={[percentageValue > 0 ? tw`text-success` : tw`text-error`]}
    >{`${currency} (${percentage})`}</Txt.Body2Regular>
  );
};

interface ICloseButton {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const CloseButton: FC<ICloseButton> = ({ onClick }) => {
  return (
    <div onClick={(e) => e.stopPropagation()} tw="flex flex-row justify-end">
      <button
        onClick={onClick}
        css={[
          tw`rounded-lg py-1 px-2 border-1 border-primary-400 text-font-100 hover:bg-primary-200 transition-all transition-duration[200ms]`,
        ]}
      >
        Close
      </button>
    </div>
  );
};
