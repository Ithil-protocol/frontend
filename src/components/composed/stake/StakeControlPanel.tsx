/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useMemo, useState } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';
import { parseUnits } from '@ethersproject/units';

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
import { useTotalSupply } from '@/hooks';

interface IStakeControlWidget {
  title: string;
  token: TokenDetails;
  value: string;
  maxValue?: string;
  onSubmit: (inputValue: string) => void;
  secondaryButton?: boolean;
  isLoading: boolean;
}

const StakeControlWidget: FC<IStakeControlWidget> = ({
  title,
  token,
  value,
  maxValue,
  onSubmit,
  secondaryButton = false,
  isLoading,
}) => {
  const [inputAmount, setInputAmount] = useState('');
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
        text={title}
        full
        action
        bold
        isLoading={isLoading}
        onClick={() => onSubmit(inputAmount)}
        secondary={secondaryButton}
      />
    </div>
  );
};

interface IStakeControlPanel {
  token: TokenDetails;
}

const StakeControlPanel: FC<IStakeControlPanel> = ({ token }) => {
  const { account } = useEthers();
  const balance = useTokenBalance(token.address, account);
  const vaultData = useVaultData(token.address);
  const vaultBalance = useBalance(token.address);
  const wrappedTokenSupply = useTotalSupply(vaultData?.wrappedToken);
  const wrappedTokenBalance = useTokenBalance(vaultData?.wrappedToken, account);
  const { stake, isLoading: isStakeLoading } = useStake();
  const { unstake, isLoading: isUnstakeLoading } = useUnstake();

  const maximumWithdrawal = useMemo(() => {
    if (!wrappedTokenBalance || vaultBalance.isZero()) return undefined;
    return new BigNumber(wrappedTokenBalance.toString())
      .multipliedBy(wrappedTokenSupply)
      .dividedBy(vaultBalance);
  }, [vaultBalance, wrappedTokenBalance, wrappedTokenSupply]);

  const handleStake = (amount: string) => {
    stake(token.address, parseUnits(amount, token.decimals));
  };
  const handleUnstake = (amount: string) => {
    unstake(token.address, parseUnits(amount, token.decimals));
  };

  return (
    <div tw="w-full flex flex-row gap-6 justify-center">
      <StakeControlWidget
        title="Deposit"
        value={
          balance ? `${formatAmount(balance?.toString())} ${token.symbol}` : '-'
        }
        token={token}
        onSubmit={handleStake}
        isLoading={isStakeLoading}
      />
      <StakeControlWidget
        title="Withdraw"
        value={
          maximumWithdrawal
            ? `${formatAmount(maximumWithdrawal?.toFixed())} ${token.symbol}`
            : '-'
        }
        maxValue={
          maximumWithdrawal && formatAmount(maximumWithdrawal?.toFixed())
        }
        token={token}
        onSubmit={handleUnstake}
        secondaryButton
        isLoading={isUnstakeLoading}
      />
    </div>
  );
};

export default StakeControlPanel;
