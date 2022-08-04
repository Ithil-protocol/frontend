/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, useState } from 'react';
import TokenList from '@ithil-protocol/deployed/goerli/deployments/tokenlist.json';

import { TokenDetails } from '@/global/types';
import Button from '@/components/based/Button';
import InputFieldMax from '@/components/composed/trade/InputFieldMax';
import InfoItem from '@/components/composed/trade/InfoItem';

interface IStakeControlWidget {
  title: string;
  token: TokenDetails;
  stakeValue: string;
  onSubmit: () => void;
  secondaryButton?: boolean;
}

const StakeControlWidget: FC<IStakeControlWidget> = ({
  title,
  token,
  stakeValue,
  onSubmit,
  secondaryButton = false,
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  return (
    <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2 my-3 border-1 border-font-200 dark:border-primary-400">
      <InfoItem label={title} value={stakeValue} />
      <InputFieldMax
        placeholder="0"
        value={stakeAmount}
        token={token}
        stateChanger={setStakeAmount}
        onChange={(value) => {
          setStakeAmount(value);
        }}
      />
      <Button
        text={title}
        full
        action
        bold
        onClick={onSubmit}
        secondary={secondaryButton}
      />
    </div>
  );
};

const StakeControlPanel = () => {
  const { tokens } = TokenList;
  return (
    <div tw="w-full flex flex-row gap-6 justify-center">
      <StakeControlWidget
        title="Deposit"
        stakeValue="4000 ($4,001.20)"
        token={tokens[0]}
        onSubmit={() => console.log('deposit')}
      />
      <StakeControlWidget
        title="Withdraw"
        stakeValue="0.000 ($0.00)"
        token={tokens[0]}
        onSubmit={() => console.log('withdraw')}
        secondaryButton
      />
    </div>
  );
};

export default StakeControlPanel;
