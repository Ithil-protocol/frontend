/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode } from 'react';

import { IBaseProps } from '@/global/types';

export interface ITxtProps extends IBaseProps {
  children: ReactNode;
}

const InnerText: FC<ITxtProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const Txt = {
  MobileMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font-200 font-medium text-mobile-medium`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  CaptionMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font-100 font-medium text-caption-medium`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Body2Regular: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-normal text-body2-regular`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Body2Bold: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font-100 font-bold text-body2-bold`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Body1Regular: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font-100 font-normal text-body1-regular`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  ButtonMedium: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-normal text-button-medium`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Body1Bold: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-bold text-body1-bold`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  InputText: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-normal text-input-text`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Heading2: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-semibold text-heading2`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
  Heading1: (props: ITxtProps) => (
    <InnerText
      {...props}
      css={[
        tw`font-sans text-font font-normal text-heading1`,
        tw`tablet:`,
        tw`desktop:`,
      ]}
    />
  ),
};

export default Txt;
