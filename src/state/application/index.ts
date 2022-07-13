import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ThemeType, WalletConnectorType } from './types';

export interface IApplicationState {
  readonly theme: ThemeType;
  readonly walletConnector: WalletConnectorType;
}

const initialState: IApplicationState = {
  theme: 'dark',
  walletConnector: 'none',
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
  },
});

export const { toggleTheme, updateWalletConnector } = ApplicationSlice.actions;

export default ApplicationSlice.reducer;
