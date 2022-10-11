/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useMemo, useState } from 'react';
import { ArrowDown } from 'phosphor-react';
import { Chain, Goerli, Hardhat, useEthers } from '@usedapp/core';
import { getChainById } from '@usedapp/core/dist/esm/src/helpers';

import Button from '@/components/based/Button';
import Txt from '@/components/based/Txt';
import Dropdown from '@/components/based/Dropdown';
import { ReactComponent as CurrencyEth } from '@/assets/images/currencyEthereum.svg';
import { IS_HARDHAT_SET } from '@/config/dapp';

interface IMenuItem {
  Icon: any;
  label: string;
  network: Chain;
  onClick: () => void;
}

const MenuItem: FC<IMenuItem> = ({ Icon, label, network, onClick }) => {
  const { switchNetwork } = useEthers();

  const handleChangeNetwork = async () => {
    switchNetwork(network.chainId).then(() => {
      window.location.reload();
    });
    onClick();
  };

  return (
    <div
      tw="flex justify-start items-center gap-3"
      onClick={handleChangeNetwork}
    >
      <Icon
        css={[tw`text-secondary-100`, network.isTestChain && tw`opacity-70`]}
      />
      <Txt.Body2Regular tw="text-secondary-100">{label}</Txt.Body2Regular>
    </div>
  );
};

const NetworkMenu = () => {
  const { chainId } = useEthers();
  const [visible, setVisibility] = useState(false);

  const chainName = useMemo(() => {
    if (!chainId) return '-';
    return getChainById(chainId)?.chainName || '-';
  }, [chainId]);

  return (
    <Dropdown
      action={
        <Button text={chainName} leftIcon={CurrencyEth} rightIcon={ArrowDown} />
      }
      menu={
        <div tw="rounded-md cursor-pointer flex flex-col justify-start gap-3 py-4 pr-16 pl-4 bg-primary-100 border border-primary-400">
          <MenuItem
            Icon={CurrencyEth}
            label={Goerli.chainName}
            network={Goerli}
            onClick={() => setVisibility(false)}
          />
          {IS_HARDHAT_SET && (
            <MenuItem
              Icon={CurrencyEth}
              label={Hardhat.chainName}
              network={Hardhat}
              onClick={() => setVisibility(false)}
            />
          )}
        </div>
      }
      visible={visible}
      onChange={(val) => setVisibility(val)}
      placement="bottom-start"
    />
  );
};

export default NetworkMenu;
