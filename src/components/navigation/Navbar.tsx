/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useState } from 'react';
import { useEthers } from '@usedapp/core';

import WalletConnectionModal from './WalletConnectionModal';
import { WalletIndicator } from './WalletIndicator';
import NetworkMenu from './NetworkMenu';
import AccountModal from './AccountModal';
import NetworkAlertBar from './NetworkAlertBar';
import MobileMenu from './MobileMenu';

import { useTheme } from '@/state/application/hooks';
import Button from '@/components/based/Button';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import ThemeSwitch from '@/components/navigation/ThemeSwitch';
import KebabMenu from '@/components/navigation/KebabMenu';
import { ReactComponent as LogoFullLight } from '@/assets/images/logoFullLight.svg';
import { ReactComponent as LogoFullDark } from '@/assets/images/logoFullDark.svg';
import { ReactComponent as LogoSymbolLight } from '@/assets/images/logoSymbolLight.svg';
import { ReactComponent as LogoSymbolDark } from '@/assets/images/logoSymbolDark.svg';

const Navbar = () => {
  const { account, chainId } = useEthers();
  const theme = useTheme();
  const [walletModalOpened, setWalletModalOpened] = useState(false);
  const [accountModalOpened, setAccountModalOpened] = useState(false);

  return (
    <div tw="flex flex-col">
      {!chainId && (
        <NetworkAlertBar content="Wrong network - Support only Goerli testnet." />
      )}
      <div tw="w-full px-5 desktop:w-[calc(100% - 9rem)] my-6 tablet:mx-auto flex flex-row items-center justify-between">
        <span tw="flex flex-row items-center mobile:flex-grow">
          <a href="/">
            <div tw="tablet:display[initial] mobile:hidden">
              {theme === 'dark' ? <LogoFullDark /> : <LogoFullLight />}
            </div>
            <div tw="tablet:hidden mobile:display[initial] mobile:flex mobile:gap-x-2">
              {theme === 'dark' ? <LogoSymbolDark /> : <LogoSymbolLight />}
            </div>
          </a>
          <span
            tw="laptop:static laptop:ml-24 laptop:mr-0 flex flex-row items-center laptop:justify-start mobile:flex-grow mobile:justify-end mobile:ml-0 mobile:mr-4 gap-x-4"
            id="navigation"
          >
            <div tw="mobile:hidden laptop:display[initial]">
              <NavigationMenu />
            </div>
            <div tw="laptop:hidden mobile:display[initial]">
              <MobileMenu />
            </div>
            <div tw="tablet:display[initial] mobile:hidden">
              <ThemeSwitch />
            </div>
          </span>
        </span>
        <span tw="flex flex-row items-center gap-2" id="connector">
          <div tw="tablet:display[initial] mobile:hidden">
            <NetworkMenu />
          </div>
          {account ? (
            <WalletIndicator onClick={() => setAccountModalOpened(true)} />
          ) : (
            <Button
              text="Connect wallet"
              action
              onClick={() => setWalletModalOpened(true)}
            />
          )}
          <KebabMenu />
        </span>
        <WalletConnectionModal
          id="connect-modal"
          open={walletModalOpened}
          onClose={() => setWalletModalOpened(false)}
        />
        <AccountModal
          open={accountModalOpened}
          onClose={() => setAccountModalOpened(false)}
        />
      </div>
    </div>
  );
};

export default Navbar;
