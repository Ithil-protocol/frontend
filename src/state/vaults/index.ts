import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VaultStatusType, VaultsType } from './types';

export interface IVaultsSlice {
  readonly vaults: VaultsType;
}

const initialState: IVaultsSlice = {
  vaults: {},
};

const VaultsSlice = createSlice({
  name: 'vaults',
  initialState,
  reducers: {
    updateVaultStatus(
      state,
      action: PayloadAction<{ address: string; status: VaultStatusType }>
    ) {
      state.vaults = {
        ...state.vaults,
        [action.payload.address]: action.payload.status,
      };
    },
  },
});

export const { updateVaultStatus } = VaultsSlice.actions;

export default VaultsSlice.reducer;
