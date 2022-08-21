import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import VaultABI from '@ithil-protocol/deployed/goerli/abi/Vault.json';
import { useCall, useContractFunction } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useCheckValidChain, useHandleTxStatus } from './index';

import { CORE } from '@/global/constants';

const abi = new Interface(VaultABI);

export function useBalance(tokenAddress: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        CORE.Vault && {
          contract: new Contract(CORE.Vault, abi),
          method: 'balance',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return new BigNumber(0);
  }
  return new BigNumber(value?.[0].toString() ?? '0');
}

export function useVaultData(tokenAddress: string) {
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        CORE.Vault && {
          contract: new Contract(CORE.Vault, abi),
          method: 'vaults',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return null;
  }
  return value;
}

export function useStake() {
  const { send, state, resetState } = useContractFunction(
    CORE.Vault && new Contract(CORE.Vault, abi),
    'stake'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    stake: send,
  };
}

export function useUnstake() {
  const { send, state, resetState } = useContractFunction(
    CORE.Vault && new Contract(CORE.Vault, abi),
    'unstake'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    unstake: send,
  };
}
