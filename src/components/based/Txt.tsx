/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode } from 'react';

import { IBaseProps } from 'src/global/types';
import { TOKEN_LIST } from 'src/global/ithil';
import { useChainId } from 'src/hooks';

export interface ITxtProps extends IBaseProps {
  children: ReactNode;
  id?: string;
}

export interface ITokenTxtProps extends ITxtProps {
  symbol: string;
}

const InnerText: FC<ITxtProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const Txt = {
  MobileMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font-200 font-medium text-mobile-medium`]}
    />
  ),
  CaptionMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font-100 font-medium text-caption-medium`]}
    />
  ),
  Body2Regular: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-normal text-body2-regular`]}
    />
  ),
  Body2Bold: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font-100 font-bold text-body2-bold`]}
    />
  ),
  Body1Regular: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font-100 font-normal text-body1-regular`]}
    />
  ),
  ButtonMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-normal text-button-medium`]}
    />
  ),
  Body1Bold: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-bold text-body1-bold`]}
    />
  ),
  InputText: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-normal text-input-text`]}
    />
  ),
  Heading2: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-semibold text-heading2`]}
    />
  ),
  Heading1: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[tw`font-sans text-font font-normal text-heading1`]}
    />
  ),
  TokenText: (props: ITokenTxtProps) => {
    const chainId = useChainId();

    return (
      <div className="flex flex-row items-center">
        <img
          tw="w-6 h-6 [z-index:3] mr-3"
          src={
            TOKEN_LIST[chainId].find((token) => token.symbol === props.symbol)
              ?.logoURI
          }
          alt={props.symbol}
        />
        <InnerText
          {...props}
          css={[tw`font-sans text-font font-normal text-body2-regular`]}
        />
      </div>
    );
  },
};

export default Txt;
