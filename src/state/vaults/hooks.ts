/* eslint-disable react-hooks/exhaustive-deps */
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import { updateVaultStatus } from './index';
import { VaultStatusType, VaultsType } from './types';

import { AppState } from 'src/state/store';

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// === vaults  ===

export const useVaultsState = () =>
  useAppSelector((state) => state.vaults.vaults) as VaultsType;

export const useUpdateVaultStatus = () => {
  const dispatch = useDispatch();
  const state = useVaultsState();
  return (address: string, status: VaultStatusType) => {
    if (!state[address]) {
      dispatch(updateVaultStatus({ address, status }));
    } else if (
      state[address].apr !== status.apr ||
      state[address].tvl.comparedTo(status.tvl) !== 0
    ) {
      dispatch(updateVaultStatus({ address, status }));
    }
  };
};
