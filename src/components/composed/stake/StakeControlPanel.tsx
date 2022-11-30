/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useMemo, useState } from 'react';
import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';
import { parseUnits } from '@ethersproject/units';
import { MaxUint256 } from '@ethersproject/constants';
import toast from 'react-hot-toast';

import TabsSwitch from '../trade/TabsSwitch';

import { CORE } from 'src/global/ithil';
import { TokenDetails } from 'src/global/types';
import Button from 'src/components/based/Button';
import InputFieldMax from 'src/components/composed/trade/InputFieldMax';
import InfoItem from 'src/components/composed/trade/InfoItem';
import { formatAmount } from 'src/global/utils';
import { useStake, useUnstake } from 'src/hooks/useVault';
import { useApprove } from 'src/hooks/useToken';
import Txt from 'src/components/based/Txt';
import { useChainId } from 'src/hooks';

interface IStakeControlWidget {
  title: string;
  token: TokenDetails;
  value: string | null;
  maxValue?: string;
  onSubmit: (inputValue: string) => Promise<string>;
  secondaryButton?: boolean;
  isLoading: boolean;
  isApproved?: boolean;
}

const StakeControlWidget: FC<IStakeControlWidget> = ({
  title,
  token,
  value,
  maxValue,
  onSubmit,
  secondaryButton = false,
  isLoading,
  isApproved = true,
}) => {
  const [inputAmount, setInputAmount] = useState('');
  const [marginMaxPercent, setMarginMaxPercent] = useState<string>('1');

  const handleSubmit = () => {
    if (!inputAmount || Number(inputAmount) <= 0) {
      toast.error('Input correct amount!');
      return;
    }
    onSubmit(inputAmount).then((res: string) => {
      if (res === 'stake') setInputAmount('0');
    });
  };
  return (
    <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 my-3 border-1 border-font-200 dark:border-primary-400">
      <InfoItem label={title} value={value} />
      <InputFieldMax
        label="Margin"
        placeholder="0"
        noMax
        value={inputAmount}
        token={token}
        stateChanger={setInputAmount}
        onChange={(value) => {
          setInputAmount(value);
        }}
        onInput={() => setMarginMaxPercent('1')}
        renderRight={
          <Txt.InputText tw="text-font-100">{token.symbol}</Txt.InputText>
        }
      />
      <TabsSwitch
        activeIndex={marginMaxPercent}
        onChange={(value: string) => {
          setMarginMaxPercent(value);
          if (maxValue) {
            setInputAmount(
              ((Number(maxValue) * Number(value)) / 100).toString()
            );
          }
        }}
        items={[...Array(4)].map((_, idx) => ({
          title: `${(idx + 1) * 25}%`,
          value: `${(idx + 1) * 25}`,
        }))}
        theme="secondary"
      />
      <Button
        text={isApproved ? title : 'Approve'}
        full
        action
        bold
        isLoading={isLoading}
        onClick={handleSubmit}
        secondary={secondaryButton}
      />
    </div>
  );
};

interface IStakeControlPanel {
  token: TokenDetails;
  vaultData: any;
  vaultBalance: any;
  wrappedTokenBalance: any;
  wrappedTokenSupply: any /** @todo replace "any" with proper typing */;
}

const StakeControlPanel: FC<IStakeControlPanel> = ({
  token,
  vaultBalance,
  wrappedTokenBalance,
  wrappedTokenSupply,
}) => {
  const { account } = useEthers();
  const chainId = useChainId();
  const balance = useTokenBalance(token.address, account);
  const { stake, isLoading: isStakeLoading } = useStake();
  const { unstake, isLoading: isUnstakeLoading } = useUnstake();
  const tokenAllowance = useTokenAllowance(
    token.address,
    account,
    CORE[chainId].Vault.address
  );
  const { approve, isLoading: isApproveLoading } = useApprove(token.address);
  //const maximumWithdrawal = useClaimable(token.address);

  const maximumWithdrawal = useMemo(() => {
    if (!wrappedTokenBalance) return null;
    if (BigNumber(wrappedTokenBalance.toString()).isZero()) return 0;
    return new BigNumber(wrappedTokenBalance.toString())
      .multipliedBy(vaultBalance)
      .dividedBy(wrappedTokenSupply);
  }, [vaultBalance, wrappedTokenBalance, wrappedTokenSupply]);

  const isApproved = useMemo(() => {
    if (!tokenAllowance || !balance) return false;
    return balance.sub(tokenAllowance).isNegative();
  }, [balance, tokenAllowance]);

  const handleStake = async (amount: string) => {
    if (isApproved) {
      await stake(token.address, parseUnits(amount, token.decimals));
      return 'stake';
    } else {
      await approve(CORE[chainId].Vault.address, MaxUint256);
      return 'approve';
    }
  };
  const handleUnstake = async (amount: string) => {
    await unstake(token.address, parseUnits(amount, token.decimals));
    return 'unstake';
  };

  return (
    <div tw="w-full flex flex-row gap-6 justify-center" id="stake-ctrl-panel">
      <StakeControlWidget
        title="Deposit"
        value={
          balance
            ? `Balance: ${formatAmount(balance?.toString(), token.decimals)} ${
                token.symbol
              }`
            : null
        }
        maxValue={formatAmount(
          balance?.toString() || '0',
          token.decimals,
          false
        )}
        token={token}
        onSubmit={handleStake}
        isLoading={isApproved ? isStakeLoading : isApproveLoading}
        isApproved={isApproved}
      />
      <StakeControlWidget
        title="Withdraw"
        value={
          maximumWithdrawal !== null
            ? `Available: ${formatAmount(
                maximumWithdrawal?.toString() || '0',
                token.decimals
              )} ${token.symbol}`
            : null
        }
        maxValue={formatAmount(
          maximumWithdrawal?.toString() || '0',
          token.decimals,
          false
        )}
        token={token}
        onSubmit={handleUnstake}
        secondaryButton
        isLoading={isUnstakeLoading}
      />
    </div>
  );
};

export default StakeControlPanel;
