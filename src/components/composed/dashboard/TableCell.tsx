/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';

import Txt from '@/components/based/Txt';
import { TOKEN_LIST } from '@/global/constants';

interface IText {
  value: string;
}

export const Text: FC<IText> = ({ value }) => {
  return <Txt.Body2Regular tw="text-secondary">{value}</Txt.Body2Regular>;
};

interface ITokenPair {
  collateralTokenSymbol: string;
  investmentTokenSymbol: string;
}

export const TokenPair: FC<ITokenPair> = ({
  collateralTokenSymbol,
  investmentTokenSymbol,
}) => {
  const { tokens } = TOKEN_LIST;
  return (
    <div tw="flex flex-row justify-start items-center gap-6">
      <div tw="relative">
        <div tw="w-7 h-7 border-radius[100%] bg-primary-100 absolute bottom[-2px] left[18px] z-index[2]"></div>
        <img
          tw="w-6 h-6 z-index[3]"
          src={
            tokens.find((token) => token.symbol === collateralTokenSymbol)
              ?.logoURI
          }
          alt={collateralTokenSymbol}
        />
        <img
          tw="w-6 h-6 left-5 bottom-0 absolute z-index[4]"
          src={
            tokens.find((token) => token.symbol === investmentTokenSymbol)
              ?.logoURI
          }
          alt={investmentTokenSymbol}
        />
      </div>
      <Text value={`${investmentTokenSymbol}/${collateralTokenSymbol}`} />
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
