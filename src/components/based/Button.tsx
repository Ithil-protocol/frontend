/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { MouseEventHandler } from 'react';
import { ClipLoader } from 'react-spinners';
import ReactGA from 'react-ga';

import Txt from './Txt';

import { IBaseProps } from '@/global/types';

interface IButtonProps extends IBaseProps {
  type?: any;
  primary?: boolean | undefined;
  secondary?: boolean;
  action?: boolean | undefined;
  full?: boolean | undefined;
  leftIcon?: any;
  rightIcon?: any;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string | undefined;
  bold?: boolean | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  eventAction?: string | undefined;
}

const Button: React.FC<IButtonProps> = (props: IButtonProps) => {
  const primary = !props.action;
  const secondary = props.secondary;
  const LeftIcon = props.leftIcon;
  const RightIcon = props.rightIcon;
  const eventAction = props.eventAction;

  const onClickHandler = async (e: any) => {
    if (props.onClick && !props.isLoading) {
      await props.onClick(e);
    }

    if (eventAction !== undefined) {
      ReactGA.event({
        category: 'btn-click',
        action: eventAction,
      });
    }
  };

  const disabled = props.isLoading || props.disabled;
  return (
    <button
      type={props.type ?? 'button'}
      className={props.className}
      css={[
        tw`border-collapse rounded-md cursor-pointer flex flex-row items-center justify-center h-9 tablet:h-10 desktop:h-11 px-2 desktop:px-4`,
        primary &&
          tw`bg-primary-200 hover:bg-hover-light dark:hover:bg-hover-dark`,
        props.action && tw`bg-action hover:bg-hover-action`,
        secondary &&
          tw`bg-opacity-0 hover:bg-hover-light dark:hover:bg-primary-300 border-1 border-font-200 dark:border-primary-400`,
        props.full && tw`w-full`,
        tw`disabled:bg-disabled-action`,
      ]}
      disabled={disabled}
      onClick={onClickHandler}
    >
      {props.isLoading ? (
        <div tw="relative h-full flex items-center justify-center px-8">
          <ClipLoader color={'#ffffff'} loading size={24} />
        </div>
      ) : (
        <>
          {LeftIcon && (
            <LeftIcon
              css={[
                primary && tw`text-secondary`,
                props.action && tw`text-primary-100`,
              ]}
              tw="mr-2"
              size={16}
            />
          )}

          <Txt.ButtonMedium
            css={[
              tw`flex-grow`,
              primary && tw`text-secondary`,
              props.action && tw`text-white`,
              secondary && tw`text-secondary`,
              props.bold && tw`font-bold`,
            ]}
          >
            {props.text}
          </Txt.ButtonMedium>

          {RightIcon && (
            <RightIcon
              css={[
                primary && tw`text-secondary`,
                props.action && tw`text-primary-100`,
              ]}
              tw="ml-2 desktop:ml-4"
              size={16}
            />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
