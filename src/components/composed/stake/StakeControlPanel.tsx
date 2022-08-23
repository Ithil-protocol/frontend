/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useMemo, useState } from 'react';
import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';
import { parseUnits } from '@ethersproject/units';
import { MaxUint256 } from '@ethersproject/constants';
import toast from 'react-hot-toast';

import { CORE } from '@/global/constants';
import { TokenDetails } from '@/global/types';
import Button from '@/components/based/Button';
import InputFieldMax from '@/components/composed/trade/InputFieldMax';
import InfoItem from '@/components/composed/trade/InfoItem';
import { formatAmount } from '@/global/utils';
import {
  useBalance,
  useStake,
  useUnstake,
  useVaultData,
} from '@/hooks/useVault';
import { useApprove, useTotalSupply } from '@/hooks/useToken';

interface IStakeControlWidget {
  title: string;
  token: TokenDetails;
  value: string;
  maxValue?: string;
  onSubmit: (inputValue: string) => Promise<void>;
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

  const handleSubmit = () => {
    if (!inputAmount || Number(inputAmount) <= 0) {
      toast.error('Input correct amount!');
      return;
    }
    onSubmit(inputAmount).then(() => setInputAmount('0'));
  };
  return (
    <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 my-3 border-1 border-font-200 dark:border-primary-400">
      <InfoItem label={title} value={value} />
      <InputFieldMax
        placeholder="0"
        value={inputAmount}
        maxValue={maxValue}
        token={token}
        stateChanger={setInputAmount}
        onChange={(value) => {
          setInputAmount(value);
        }}
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
  balance: any;
  account: string;
  vaultData: any;
  vaultBalance: any;
  wrappedTokenBalance: any;
  wrappedTokenSupply: any /** @todo replace "any" with proper typing */;
}

const StakeControlPanel: FC<IStakeControlPanel> = ({
  token,
  balance,
  account,
  vaultData,
  vaultBalance,
  wrappedTokenBalance,
  wrappedTokenSupply,
}) => {
  const { stake, isLoading: isStakeLoading } = useStake();
  const { unstake, isLoading: isUnstakeLoading } = useUnstake();
  const tokenAllowance = useTokenAllowance(
    token.address,
    account,
    CORE.Vault.address
  );
  const { approve, isLoading: isApproveLoading } = useApprove(token.address);

  const isApproved = useMemo(() => {
    if (!tokenAllowance || !balance) return false;
    return balance.sub(tokenAllowance).isNegative();
  }, [balance, tokenAllowance]);

  const maximumWithdrawal = useMemo(() => {
    if (!wrappedTokenBalance || vaultBalance.isZero()) return undefined;
    return new BigNumber(wrappedTokenBalance.toString())
      .multipliedBy(wrappedTokenSupply)
      .dividedBy(vaultBalance);
  }, [vaultBalance, wrappedTokenBalance, wrappedTokenSupply]);

  const handleStake = async (amount: string) => {
    if (isApproved) {
      await stake(token.address, parseUnits(amount, token.decimals));
    } else {
      await approve(CORE.Vault.address, MaxUint256);
    }
  };
  const handleUnstake = async (amount: string) => {
    console.log('amount', amount);
    await unstake(token.address, parseUnits(amount, token.decimals));
  };

  return (
    <div tw="w-full flex flex-row gap-6 justify-center">
      <StakeControlWidget
        title="Deposit"
        value={
          balance
            ? `Balance: ${formatAmount(balance?.toString(), token.decimals)} ${
                token.symbol
              }`
            : '-'
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
          maximumWithdrawal
            ? `Available: ${formatAmount(
                maximumWithdrawal?.toFixed(),
                token.decimals
              )} ${token.symbol}`
            : '-'
        }
        maxValue={formatAmount(maximumWithdrawal || '0', token.decimals, false)}
        token={token}
        onSubmit={handleUnstake}
        secondaryButton
        isLoading={isUnstakeLoading}
      />
    </div>
  );
};

export default StakeControlPanel;
