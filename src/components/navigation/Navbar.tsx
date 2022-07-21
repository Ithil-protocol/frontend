/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useState } from 'react';
import { useEthers } from '@usedapp/core';

import WalletConnectionModal from './WalletConnectionModal';
import { WalletIndicator } from './WalletIndicator';
import NetworkMenu from './NetworkMenu';
import AccountModal from './AccountModal';

import { useTheme } from '@/state/application/hooks';
import Button from '@/components/based/Button';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import ThemeSwitch from '@/components/navigation/ThemeSwitch';
import KebabMenu from '@/components/navigation/KebabMenu';
import { ReactComponent as LogoFullLight } from '@/assets/images/logoFullLight.svg';
import { ReactComponent as LogoFullDark } from '@/assets/images/logoFullDark.svg';

const Navbar = () => {
  const { account } = useEthers();
  const theme = useTheme();
  const [walletModalOpened, setWalletModalOpened] = useState(false);
  const [accountModalOpened, setAccountModalOpened] = useState(false);

  return (
    <div tw="w-full px-5 desktop:w-[calc(100% - 9rem)] my-6 tablet:mx-auto flex flex-row items-center justify-between">
      <span tw="flex flex-row items-center">
        {theme === 'dark' ? <LogoFullDark /> : <LogoFullLight />}
        <span tw="ml-24 flex flex-row items-center">
          <NavigationMenu />
          <ThemeSwitch />
        </span>
      </span>
      <span tw="flex flex-row items-center gap-2">
        <NetworkMenu />
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
        open={walletModalOpened}
        onClose={() => setWalletModalOpened(false)}
      />
      <AccountModal
        open={accountModalOpened}
        onClose={() => setAccountModalOpened(false)}
      />
    </div>
  );
};

export default Navbar;
