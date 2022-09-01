import { useTokenBalance } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useRiskFactor } from './useRiskFactor';
import { useVaultData } from './useVault';

import { StrategyContractType } from '@/global/types';
import { CORE } from '@/global/constants';

export function useMaxLeverage(
  spentToken: string,
  obtainedToken: string,
  margin: BigNumber,
  strategy: StrategyContractType
) {
  const vaultData = useVaultData(spentToken);
  const balance = useTokenBalance(spentToken, CORE.Vault.address);
  const riskFactor: BigNumber = useRiskFactor(strategy, obtainedToken);
  const netLoans: BigNumber = BigNumber(vaultData?.netLoans.toString());
  const baseFee: BigNumber = BigNumber(vaultData?.baseFee.toString());
  const insuranceReserveBalance: BigNumber = BigNumber(
    vaultData?.insuranceReserveBalance.toString()
  );

  const baseIR = baseFee.plus(
    netLoans
      .plus(BigNumber.max(netLoans.minus(insuranceReserveBalance), 0))
      .multipliedBy(riskFactor)
      .dividedBy(
        BigNumber(balance?.toString() || 0)
          .plus(netLoans)
          .minus(insuranceReserveBalance)
      )
  );
  const maxLeverage = BigNumber('500').dividedBy(baseIR);

  return BigNumber.max(
    BigNumber.min(
      maxLeverage,
      BigNumber(balance?.toString() || 0)
        .minus(insuranceReserveBalance)
        .dividedBy(margin)
    ),
    1
  ).toNumber();
}
