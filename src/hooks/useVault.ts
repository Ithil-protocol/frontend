import { Contract } from '@ethersproject/contracts';
import { useCall, useContractFunction } from '@usedapp/core';
import BigNumber from 'bignumber.js';

import { useChainId, useCheckValidChain, useHandleTxStatus } from './index';

import { CORE } from 'src/global/ithil';

export function useBalance(tokenAddress: string) {
  const chainId = useChainId();
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        CORE[chainId].Vault && {
          contract: new Contract(
            CORE[chainId].Vault.address,
            CORE[chainId].Vault.abi
          ),
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
  const chainId = useChainId();
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        CORE[chainId].Vault && {
          contract: new Contract(
            CORE[chainId].Vault.address,
            CORE[chainId].Vault.abi
          ),
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
  const chainId = useChainId();
  const { send, state, resetState } = useContractFunction(
    CORE[chainId].Vault &&
      new Contract(CORE[chainId].Vault.address, CORE[chainId].Vault.abi),
    'stake'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    stake: send,
  };
}

export function useUnstake() {
  const chainId = useChainId();
  const { send, state, resetState } = useContractFunction(
    CORE[chainId].Vault &&
      new Contract(CORE[chainId].Vault.address, CORE[chainId].Vault.abi),
    'unstake'
  );
  const isLoading = useHandleTxStatus(state, resetState);

  return {
    isLoading,
    unstake: send,
  };
}

export function useClaimable(tokenAddress: string) {
  const chainId = useChainId();
  const isValid = useCheckValidChain();

  const { value, error } =
    useCall(
      isValid &&
        CORE[chainId].Vault && {
          contract: new Contract(
            CORE[chainId].Vault.address,
            CORE[chainId].Vault.abi
          ),
          method: 'claimable',
          args: [tokenAddress],
        }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return null;
  }
  return value;
}
