/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Circle } from 'phosphor-react';

import APP_ROUTES from 'src/config/routes';
import Txt from 'src/components/based/Txt';

interface INavigationMenu {
  onMenuClick?: () => void;
}

const NavigationMenu: FC<INavigationMenu> = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;

  const selectedRoute =
    APP_ROUTES.find((i) => new RegExp(`${i.path}/.*`).test(path)) ??
    APP_ROUTES[0];

  return (
    <div tw="flex flex-row items-center [min-width:256px] bg-primary">
      <div tw="flex px-3 gap-3 desktop:gap-6">
        {APP_ROUTES.filter((route) => route.isNavLinked).map((route) => {
          const isSelected = route.path === selectedRoute?.path;
          return (
            <Link
              to={route.path}
              key={route.path}
              tw="text-secondary flex flex-col [align-items:center] cursor-pointer rounded-md w-auto relative"
              onClick={() => onMenuClick && onMenuClick()}
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
    </div>
  );
};

export default NavigationMenu;
