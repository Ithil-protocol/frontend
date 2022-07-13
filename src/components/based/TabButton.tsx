/** @jsxImportSource @emotion/react */
import React, { FC, MouseEventHandler } from 'react';
import tw from 'twin.macro';

import Txt from './Txt';

interface ITabButton {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  className?: string | undefined;
}

const TabButton: FC<ITabButton> = ({ text, onClick, active, className }) => {
  return (
    <button
      css={[
        tw`bg-primary-300 border-0 rounded-md cursor-pointer flex flex-row items-center px-8 py-2.5`,
        active && tw`bg-action`,
      ]}
      className={className}
      onClick={onClick}
    >
      <Txt.Body2Regular
        css={[tw`text-secondary`, active && tw`text-primary-100`]}
      >
        {text}
      </Txt.Body2Regular>
    </button>
  );
};

export default TabButton;
