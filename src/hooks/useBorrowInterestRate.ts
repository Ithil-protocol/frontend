import { useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useVaultData } from './useVault';
import { useComputePairRiskFactor } from './useComputePairRiskFactor';
import { useChainId } from '.';

import { StrategyContractType } from '@/global/types';
import { CORE } from '@/global/ithil';
import { baseInterestRate } from '@/global/utils';

export function useBorrowInterestRate(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  borrowed: BigNumber,
  minObtained: BigNumber,
  strategy: StrategyContractType,
  collateralIsSpentToken: boolean
) {
  const chainId = useChainId();
  const vaultData = useVaultData(spentToken);
  const balance = useTokenBalance(spentToken, CORE[chainId].Vault.address);
  const dstBalanceNative = useTokenBalance(obtainedToken, strategy.address);
  const riskFactor: BigNumber = useComputePairRiskFactor(
    spentToken,
    obtainedToken,
    strategy
  );
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
  const dstBalance: BigNumber = BigNumber(dstBalanceNative?.toString() || 0);
  const insuranceReserveBalance: BigNumber = BigNumber(
    vaultData?.insuranceReserveBalance.toString()
  );

  const baseIR = baseInterestRate(
    baseFee,
    netLoans,
    insuranceReserveBalance,
    BigNumber(balance?.toString() || 0),
    borrowed,
    riskFactor
  );

  const leveragedAmount = margin.isZero()
    ? BigNumber(0)
    : collateralIsSpentToken
    ? borrowed.dividedBy(margin)
    : minObtained.dividedBy(margin);
  const numerator = minObtained.plus(dstBalance.multipliedBy(2));
  const denominator = numerator.plus(minObtained);

  const borrowIR = margin.isZero()
    ? BigNumber(0)
    : baseIR
        .multipliedBy(leveragedAmount)
        .multipliedBy(numerator)
        .dividedBy(denominator);

  return borrowIR;
}
