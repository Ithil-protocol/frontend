import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ThemeType, WalletConnectorType } from './types';

export interface IApplicationState {
  readonly theme: ThemeType;
  readonly walletConnector: WalletConnectorType;
  readonly txTimestamp: number;
}

const initialState: IApplicationState = {
  theme: 'dark',
  walletConnector: 'none',
  txTimestamp: 0,
};

const ApplicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    updateWalletConnector(state, action: PayloadAction<WalletConnectorType>) {
      state.walletConnector = action.payload;
    },
    updateTxTimestamp(state, action: PayloadAction<number>) {
      state.txTimestamp = action.payload;
    },
  },
});

export const { toggleTheme, updateWalletConnector, updateTxTimestamp } =
  ApplicationSlice.actions;

export default ApplicationSlice.reducer;
