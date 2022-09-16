import { useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useComputePairRiskFactor } from './useComputePairRiskFactor';
import { useVaultData } from './useVault';

import { StrategyContractType } from '@/global/types';
import { CORE } from '@/global/constants';
import { baseInterestRate } from '@/global/utils';

export function useMaxLeverage(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  strategy: StrategyContractType,
  borrowed: BigNumber
) {
  const vaultData = useVaultData(spentToken);
  const balance = useTokenBalance(spentToken, CORE.Vault.address);
  const riskFactor: BigNumber = useComputePairRiskFactor(
    spentToken,
    obtainedToken,
    strategy
  );
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
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

  const maxLeverage = BigNumber.max(
    BigNumber.min(
      BigNumber('500').dividedBy(baseIR).multipliedBy(2).plus(1),
      BigNumber(balance?.toString() || 0)
        .minus(insuranceReserveBalance)
        .dividedBy(margin)
        .plus(1)
    ),
    1
  ).toNumber();

  return maxLeverage;
}
