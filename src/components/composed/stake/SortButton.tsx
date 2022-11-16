/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useState } from 'react';
import { Placement } from '@popperjs/core';

import Dropdown from 'src/components/based/Dropdown';
import Button from 'src/components/based/Button';
import Txt from 'src/components/based/Txt';
import { KeyableType } from 'src/global/types';

interface IMenuItem {
  label: string;
  onClick: () => void;
}

const MenuItem: FC<IMenuItem> = ({ label, onClick }) => {
  return (
    <div tw="flex justify-start items-center gap-3" onClick={onClick}>
      <Txt.Body2Regular tw="text-secondary-100">{label}</Txt.Body2Regular>
    </div>
  );
};

interface ISortButton {
  buttonLabel: string;
  selected: boolean;
  onChange: (value: string) => void;
  menu: KeyableType;
  placement?: Placement;
}

const SortButton: FC<ISortButton> = ({
  selected,
  buttonLabel,
  onChange,
  menu,
  placement,
}) => {
  const [visible, setVisibility] = useState(false);

  const handleMenuItemClick = (value: string) => {
    onChange(value);
    setVisibility(false);
  };

  return (
    <Dropdown
      action={<Button text={buttonLabel} action={selected} bold={selected} />}
      menu={
        <div tw="rounded-md cursor-pointer flex flex-col justify-start gap-3 py-4 pr-16 pl-4 bg-primary-100 border-1 border-primary-400">
          {Object.keys(menu).map((item) => (
            <MenuItem
              key={item}
              label={menu[item]}
              onClick={() => handleMenuItemClick(item)}
            />
          ))}
        </div>
      }
      visible={visible}
      onChange={(val) => setVisibility(val)}
      placement={placement || 'bottom-start'}
    />
  );
};

export default SortButton;
