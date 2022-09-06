/** @jsxImportSource @emotion/react */
import 'twin.macro';

import React, { useEffect, useMemo, useState } from 'react';
import { FadersHorizontal } from 'phosphor-react';
import BigNumber from 'bignumber.js';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { MaxUint256 } from '@ethersproject/constants';
import { formatUnits } from '@ethersproject/units';
import { toast } from 'react-toastify';

import { TokenDetails } from '@/global/types';
import Txt from '@/components/based/Txt';
import SliderBar from '@/components/based/Slidebar';
import InputField from '@/components/based/InputField';
import Page from '@/components/based/Page';
import Button from '@/components/based/Button';
import InfoItem from '@/components/composed/trade/InfoItem';
import TokenInputField from '@/components/composed/trade/TokenInputField';
import { baseInterestRate, formatAmount, parseAmount } from '@/global/utils';
import { useLatestVault } from '@/hooks/useYearnRegistry';
import { useQuoter } from '@/hooks/useQuoter';
import { useAllowance, useApprove } from '@/hooks/useToken';
import { useOpenPosition } from '@/hooks/useOpenPosition';
import { useMaxLeverage } from '@/hooks/useMaxLeverage';
import APYChart from '@/components/composed/trade/APYChart';
import { STRATEGIES, DEFAULT_DEADLINE, TOKEN_LIST } from '@/global/constants';
import { useBorrowInterestRate } from '@/hooks/useBorrowInterestRate';

export default function YearnStrategyPage() {
  const { account } = useEthers();

  const [spentToken, setSpentToken] = useState<TokenDetails>(TOKEN_LIST[0]);
  const [marginAmount, setMarginAmount] = useState<string>('0');
  const [leverage, setLeverage] = useState<number>(1);

  const [baseApy, setBaseApy] = useState<number>(0);

  const [slippagePercent, setSlippagePercent] = useState<string>(
    STRATEGIES.YearnStrategy.defaultSlippage
  );
  const [deadline, setDeadline] = useState<string>(DEFAULT_DEADLINE);
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);

  const tokenBalance = useTokenBalance(spentToken.address, account);
  const obtainedTokenAddress = useLatestVault(spentToken.address);

  const slippageValue = useMemo(() => {
    return (100 - Number(slippagePercent)) / 100;
  }, [slippagePercent]);

  const maxSpent = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals).multipliedBy(
      leverage
    );
  }, [leverage, marginAmount, spentToken]);

  const marginAmountValue = useMemo(() => {
    return parseAmount(marginAmount, spentToken.decimals);
  }, [marginAmount, spentToken]);

  const quoteValue = useQuoter(
    spentToken.address,
    obtainedTokenAddress,
    maxSpent,
    STRATEGIES.YearnStrategy
  );

  const maxLeverage = useMaxLeverage(
    spentToken.address,
    obtainedTokenAddress,
    marginAmountValue,
    STRATEGIES.YearnStrategy
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const minObtained = useMemo(() => {
    return quoteValue.multipliedBy(slippageValue);
  }, [quoteValue, slippageValue]);

  const borrowed = useMemo(() => {
    return maxSpent.comparedTo(marginAmountValue) > 0
      ? maxSpent.minus(marginAmountValue)
      : BigNumber(0);
  }, [maxSpent, marginAmountValue]);

  const allowance = useAllowance(
    spentToken.address,
    STRATEGIES.YearnStrategy.address
  );

  const { isLoading: isLoadingApprove, approve } = useApprove(
    spentToken.address
  );

  const { isLoading: isLoadingOpenPos, openPosition } = useOpenPosition(
    STRATEGIES.YearnStrategy
  );

  const borrowIR = useBorrowInterestRate(
    spentToken.address,
    obtainedTokenAddress,
    marginAmountValue,
    borrowed,
    minObtained,
    STRATEGIES.YearnStrategy
  );

  const borrowInterestPercent = useMemo(() => {
    return borrowIR.dividedBy(100);
  }, [borrowIR, leverage]);

  const estimatedAPY = useMemo(() => {
    return leverage * (baseApy - borrowIR.dividedBy(100).toNumber());
  }, [baseApy, borrowIR, leverage]);

  const disabledButton = useMemo(() => {
    return borrowInterestPercent.comparedTo(5) === 1;
  }, [borrowInterestPercent]);

  const buttonText = useMemo(() => {
    if (!allowance) return 'Open';
    const marginedAmountValue = parseAmount(marginAmount, spentToken.decimals);

    if (new BigNumber(allowance.toString()).isLessThan(marginedAmountValue)) {
      return 'Approve';
    }
    return 'Open';
  }, [allowance, marginAmount, spentToken.decimals]);

  const handleApprove = () => {
    if (!account || !Number(marginAmount)) return;
    approve(STRATEGIES.YearnStrategy.address, MaxUint256);
  };

  const handleOpenOrder = async () => {
    if (!account) {
      toast.error('Connect to a wallet!');
      return;
    }
    if (!tokenBalance || tokenBalance.isZero()) {
      toast.error('Purchase the spent tokens!');
      return;
    }
    if (
      Number(marginAmount) >
      Number(formatUnits(tokenBalance, spentToken.decimals))
    ) {
      toast.error('Invalid margin amount!');
      return;
    }
    const deadlineTimestamp =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);
    const newOrder = {
      spentToken: spentToken.address,
      obtainedToken: obtainedTokenAddress,
      collateral: parseAmount(marginAmount, spentToken.decimals).toFixed(0),
      collateralIsSpentToken: true,
      minObtained: 0,
      maxSpent: maxSpent.toFixed(0),
      deadline: deadlineTimestamp,
    };
    openPosition(newOrder, { gasLimit: 700_000 });
  };

  const handleExecute = () => {
    if (!marginAmount || Number(marginAmount) <= 0) {
      toast.error('Your margin is below minimum!');
      return;
    }
    if (buttonText === 'Approve') {
      handleApprove();
    } else {
      handleOpenOrder();
    }
  };

  const sliderMarks = useMemo(() => {
    const marks: { [key: number]: string } = {};
    const increment = Math.max(Math.floor(maxLeverage / 10), 1);
    for (let i = 1; i <= maxLeverage; i += increment) {
      marks[i] = `${i}x`;
    }
    return marks;
  }, [maxLeverage]);

  useEffect(() => {
    setLeverage(1);
  }, [maxLeverage]);

  return (
    <Page
      heading="Yearn Strategy"
      description="Leveraged staking on the most common yVaults"
    >
      {disabledButton && (
        <div tw="fixed bottom-4 left-0 right-0 h-auto flex justify-center items-center">
          <div tw="bg-error p-4 w-auto rounded-lg text-white-100 font-bold">
            Borrow interest exceeds maximum (5%)
          </div>
        </div>
      )}
      <div tw="w-full flex flex-col desktop:flex-row gap-6">
        <div tw="flex flex-col gap-3 flex-grow w-full desktop:w-4/12">
          <div tw="flex flex-col justify-between items-center rounded-xl p-5 bg-primary-100 gap-7">
            <div tw="flex w-full justify-between items-center" id="margin">
              <TokenInputField
                label="Margin"
                availableTokens={TOKEN_LIST}
                value={marginAmount}
                setValue={setMarginAmount}
                stateChanger={setMarginAmount}
                token={spentToken}
                onTokenChange={(value) => setSpentToken(value)}
              />
            </div>
            <SliderBar
              id="leverage"
              label="Leverage"
              tooltipText="The capital boost on the margin invested"
              min={1}
              max={maxLeverage}
              step={0.2}
              value={Number(leverage.toFixed(1))}
              onChange={(value) => setLeverage(value as number)}
              marks={sliderMarks}
            />
            <div tw="w-full">
              <InfoItem
                tooltipText="The max amount you invest including collateral"
                label="Max Spent"
                value={
                  !maxSpent.isNaN()
                    ? formatAmount(maxSpent, spentToken.decimals)
                    : '0'
                }
                details={spentToken.symbol}
              />
              <InfoItem
                tooltipText="Base annualised profit offered by the strategy"
                label="Base APY"
                value={`${baseApy.toFixed(2)}x`}
              />
              <InfoItem
                tooltipText="Percentage to be paid as borrowing fees"
                label="Borrow Interest"
                value={
                  borrowInterestPercent.isNaN()
                    ? '0%'
                    : `-${borrowInterestPercent.toFixed(2)}%`
                }
              />
              <InfoItem
                tooltipText="Maximum amount to be spent in the position, including collateral"
                label="Estimated APY"
                value={estimatedAPY ? `${estimatedAPY.toFixed(2)}%` : '0%'}
              />
            </div>
            <div tw="w-full">
              {showAdvancedOptions ? (
                <>
                  <div tw="my-4 w-full flex flex-row justify-between items-center">
                    <Txt.Heading2>Advanced options</Txt.Heading2>
                    <div>
                      <button
                        tw="my-4 w-full flex justify-center items-center gap-2"
                        onClick={() =>
                          setShowAdvancedOptions(!showAdvancedOptions)
                        }
                      >
                        <FadersHorizontal size={20} tw="text-font-100" />
                      </button>{' '}
                    </div>
                  </div>

                  <div tw="flex flex-col w-full gap-7">
                    <InputField
                      tooltipText="Maximum tolerated price change"
                      label="Slippage"
                      placeholder="0"
                      value={slippagePercent}
                      onChange={(value) => setSlippagePercent(value)}
                      renderRight={
                        <Txt.InputText tw="text-font-100">%</Txt.InputText>
                      }
                    />
                    <InputField
                      tooltipText="Deadline for the execution time, if the transaction is executed afterwards it will revert"
                      label="Deadline"
                      placeholder="30 mins"
                      value={deadline}
                      onChange={(value) => setDeadline(value)}
                      renderRight={
                        <Txt.InputText tw="text-font-100">min</Txt.InputText>
                      }
                    />
                  </div>
                </>
              ) : (
                <button
                  tw="my-4 w-full flex justify-center items-center gap-2"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  <FadersHorizontal size={20} tw="text-font-100" />
                  <Txt.Body2Regular tw="text-font-100">
                    Advanced options
                  </Txt.Body2Regular>
                </button>
              )}
            </div>
            <Button
              id="trade"
              text={buttonText}
              full
              action
              bold
              disabled={!allowance || disabledButton}
              onClick={handleExecute}
              isLoading={isLoadingApprove || isLoadingOpenPos}
            />
          </div>
        </div>
        <APYChart spentToken={spentToken} setBaseApy={setBaseApy} />
      </div>
    </Page>
  );
}
