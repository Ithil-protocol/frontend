/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Circle } from 'phosphor-react';

import ThemeSwitch from './ThemeSwitch';
import NetworkMenu from './NetworkMenu';

import Txt from 'src/components/based/Txt';
import Modal from 'src/components/based/Modal';
import { useTheme } from 'src/state/application/hooks';
import APP_ROUTES from 'src/config/routes';
import { ReactComponent as LogoFullLight } from 'src/assets/images/logoFullLight.svg';
import { ReactComponent as LogoFullDark } from 'src/assets/images/logoFullDark.svg';

interface IMobileMenuModal {
  open: boolean;
  onClose(): void;
}

const MobileMenuModal: FC<IMobileMenuModal> = ({ open, onClose }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;

  const selectedRoute =
    APP_ROUTES.find((i) => new RegExp(`${i.path}/.*`).test(path)) ??
    APP_ROUTES[0];

  return (
    <Modal tw="bg-secondary [min-width:450]" open={open} onClose={onClose}>
      <div tw="w-full h-full flex flex-col">
        <Txt.Heading2 tw="flex justify-center mb-6">
          {theme === 'dark' ? <LogoFullDark /> : <LogoFullLight />}
        </Txt.Heading2>
        <div tw="w-full [height:1px] bg-font-200" />
        <div tw="w-full grow flex items-center justify-center flex-col gap-6">
          {APP_ROUTES.filter((route) => route.isNavLinked).map((route) => {
            const isSelected = route.path === selectedRoute?.path;
            return (
              <Link
                to={route.path}
                key={route.path}
                tw="text-secondary flex flex-col [align-items:center] cursor-pointer rounded-md w-auto relative"
                onClick={onClose}
              >
                <Txt.Body1Regular
                  css={[tw`text-secondary`, isSelected && tw`font-bold`]}
                >
                  {route.title}
                </Txt.Body1Regular>
                {isSelected && (
                  <Circle tw="absolute top-4 mt-2 desktop:top-6 w-2 h-2 bg-secondary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
        <div tw="w-full [height:1px] bg-font-200 tablet:hidden mobile:[display:initial]" />
        <div tw="w-full items-center justify-center flex-row gap-6 pt-4 tablet:hidden mobile:flex">
          <ThemeSwitch />
          <NetworkMenu />
        </div>
      </div>
    </Modal>
  );
};

export default MobileMenuModal;
