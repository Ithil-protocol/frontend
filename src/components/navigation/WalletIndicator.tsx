/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC } from 'react';
import { shortenAddress, useEtherBalance, useEthers } from '@usedapp/core';

import Txt from '@/components/based/Txt';
import { useWalletConnectorIcon } from '@/state/application/hooks';
import { formatAmount } from '@/global/utils';

interface IWalletIndicator {
  onClick: () => void;
}

export const WalletIndicator: FC<IWalletIndicator> = ({ onClick }) => {
  const { account } = useEthers();
  const balance = useEtherBalance(account);
  const WalletConnectorIcon = useWalletConnectorIcon();

  return (
    <div
      tw="bg-primary-200 border-none rounded-md cursor-pointer flex flex-row items-center h-9 max-h-9 tablet:h-10 desktop:h-11 desktop:max-h-11 px-2 hover:bg-hover-light dark:hover:bg-hover-dark"
      onClick={onClick}
    >
      {!!balance && (
        <Txt.ButtonMedium tw="mr-2">{`${formatAmount(
          balance.toString()
        )} ETH`}</Txt.ButtonMedium>
      )}
      <div tw="h-7 max-h-7 tablet:h-8   desktop:h-8 desktop:max-h-8 px-2 rounded-md bg-primary-400 flex flex-row justify-center items-center gap-1 dark:bg-primary-100">
        {WalletConnectorIcon && <WalletConnectorIcon tw="h-4 w-4" />}
        {account && (
          <Txt.ButtonMedium tw="line-height[0px]">
            {shortenAddress(account)}
          </Txt.ButtonMedium>
        )}
      </div>
    </div>
  );
};
