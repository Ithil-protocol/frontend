/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';
import tw from 'twin.macro';
import { useEthers } from '@usedapp/core';

import Modal from '@/components/based/Modal';
import Txt from '@/components/based/Txt';
import { useUpdateWalletConnector } from '@/state/application/hooks';
import { injected, walletconnect } from '@/config/connectors';
import { ReactComponent as MetaMaskIcon } from '@/assets/images/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/walletconnect.svg';

interface IWalletModal {
  id?: string;
  open: boolean;
  onClose(): void;
}

const WalletConnectionModal: FC<IWalletModal> = ({ id, open, onClose }) => {
  const { activate } = useEthers();
  const updateWalletConnector = useUpdateWalletConnector();
  const isMetamaskInstalled = (window as any)?.ethereum;

  return (
    <Modal tw="bg-secondary" open={open} onClose={onClose} id={id}>
      <div tw="flex flex-col justify-center items-center">
        <Txt.Heading2 tw="self-end">Connect to a wallet</Txt.Heading2>
      </div>
      <Txt.Body2Regular tw="w-96 self-start my-3">
        By connecting a wallet, I agree to Ithil{' '}
        <a tw="cursor-pointer">Terms of Use</a>,{' '}
        <a tw="cursor-pointer">Cookies Policy</a>
        and <a tw="cursor-pointer">Privacy Policy</a>.
      </Txt.Body2Regular>
      <div tw="w-full height[1px] bg-primary-300 my-4"></div>
      <div tw="w-full height[384px]">
        <div
          tw="w-full flex flex-row justify-between cursor-pointer"
          onClick={() => {
            activate(injected);
            updateWalletConnector('injected');
            onClose();
          }}
        >
          <div tw="flex flex-row justify-start items-center p-0 my-2 gap-2">
            <MetaMaskIcon tw="h-9 w-9 m-2" />
            <div tw="flex flex-col justify-start">
              <Txt.Body2Bold css={[!isMetamaskInstalled && tw`text-secondary`]}>
                Metamask
                {!isMetamaskInstalled && '(Not installed)'}
              </Txt.Body2Bold>
            </div>
          </div>
        </div>
        <div
          tw="w-full flex flex-row justify-between cursor-pointer"
          onClick={async () => {
            activate(walletconnect);
            updateWalletConnector('walletconnect');
            onClose();
          }}
        >
          <div tw="flex flex-row justify-start items-center p-0 my-2 gap-2">
            <WalletConnectIcon tw="h-9 w-9 m-2" />
            <div tw="flex flex-col justify-start">
              <Txt.Body2Bold>WalletConnect</Txt.Body2Bold>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectionModal;
