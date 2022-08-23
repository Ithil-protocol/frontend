/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Goerli, useEthers } from '@usedapp/core';

interface INetworkAlertBar {
  content: string | ReactNode;
}

const NetworkAlertBar: FC<INetworkAlertBar> = ({ content }) => {
  const { switchNetwork } = useEthers();

  const hanldeSwitchNetwork = () => {
    switchNetwork(Goerli.chainId).then(() => {
      window.location.reload();
    });
  };

  return (
    <div tw="w-full height[50px] bg-error text-white font-bold flex items-center justify-center">
      {content}
      <button
        onClick={hanldeSwitchNetwork}
        css={[
          tw`ml-3 rounded-lg py-1 px-3 border-1 border-white text-white bg-white-100 bg-opacity-10 hover:bg-white hover:text-error transition-all transition-duration[200ms]`,
        ]}
      >
        Switch
      </button>
    </div>
  );
};

export default NetworkAlertBar;
