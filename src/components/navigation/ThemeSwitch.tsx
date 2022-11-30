/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC } from 'react';
import Switch from 'react-switch';

import { IBaseProps } from 'src/global/types';
import { useTheme, useToggleTheme } from 'src/state/application/hooks';
import { ReactComponent as SwitchDark } from 'src/assets/images/switchDark.svg';
import { ReactComponent as SwitchLight } from 'src/assets/images/switchLight.svg';

const ThemeSwitch: FC<IBaseProps> = ({ className }) => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();

  return (
    <Switch
      className={className}
      onChange={toggleTheme}
      uncheckedIcon={
        <div tw="flex justify-center items-center [height:100%]">
          <SwitchDark />
        </div>
      }
      checkedIcon={
        <div tw="flex justify-center items-center [height:100%]">
          <SwitchLight />
        </div>
      }
      checked={theme === 'light'}
      onColor="#F2F5F6"
      offColor="#20293A"
      onHandleColor="#FB8E51"
      offHandleColor="#F3E7A8"
    />
  );
};

export default ThemeSwitch;
