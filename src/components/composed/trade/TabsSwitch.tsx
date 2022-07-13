/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, MouseEventHandler } from 'react';

import { PositionType } from '@/global/types';
import Txt from '@/components/based/Txt';

type TabType = {
  title: string;
  value: string;
  icon?: any;
};

interface ITabButton {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  Icon?: any;
}

const TabButton: FC<ITabButton> = ({ text, onClick, active, Icon }) => {
  return (
    <button
      css={[
        tw`border-0 rounded-md cursor-pointer flex flex-row items-center justify-center px-3 py-2`,
        tw`bg-none text-secondary w-1/2`,
        active && tw`bg-font-100 dark:bg-font`,
      ]}
      onClick={onClick}
    >
      {Icon && <Icon />}
      <Txt.Body1Regular
        css={[
          tw`text-secondary`,
          Icon && tw`ml-2`,
          active && tw`text-primary-100 font-bold`,
        ]}
      >
        {text}
      </Txt.Body1Regular>
    </button>
  );
};

interface ITabsSwitch {
  className?: string | undefined;
  items: TabType[];
  activeIndex: string;
  onChange: (value: string) => void;
}

const TabsSwitch: FC<ITabsSwitch> = ({ activeIndex, onChange, items }) => {
  return (
    <div tw="w-full">
      <div
        css={[
          tw`flex flex-row items-center gap-2 border-2 border-font-200 rounded-xl p-1 dark:border-primary-400`,
        ]}
      >
        {items.map((tab) => (
          <TabButton
            key={tab.value}
            Icon={tab.icon}
            text={tab.title}
            active={tab.value == activeIndex}
            onClick={() => onChange(tab.value as PositionType)}
          />
        ))}
      </div>
    </div>
  );
};

export default TabsSwitch;
