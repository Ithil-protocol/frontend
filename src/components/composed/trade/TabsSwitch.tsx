/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, MouseEventHandler } from 'react';

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
  theme: 'primary' | 'secondary';
}

const TabButton: FC<ITabButton> = ({ text, onClick, active, Icon, theme }) => {
  return (
    <button
      css={[
        tw`rounded-md cursor-pointer flex flex-row items-center justify-center px-3 py-2`,
        tw`bg-none text-secondary w-1/2`,
        active && tw`bg-font-100 dark:bg-font`,
        theme === 'secondary'
          ? tw`border-1 border-font-200 dark:border-primary-400 max-width[70px]`
          : tw`border-none`,
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
  theme?: 'primary' | 'secondary';
}

const TabsSwitch: FC<ITabsSwitch> = ({
  activeIndex,
  onChange,
  items,
  theme = 'primary',
}) => {
  return (
    <div tw="w-full">
      <div
        css={[
          tw`flex flex-row items-center gap-2 rounded-xl p-1`,
          theme === 'primary'
            ? tw`border-2 border-font-200 dark:border-primary-400`
            : tw`justify-between`,
        ]}
      >
        {items.map((tab) => (
          <TabButton
            key={tab.value}
            Icon={tab.icon}
            text={tab.title}
            active={tab.value == activeIndex}
            onClick={() => onChange(tab.value)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

export default TabsSwitch;
