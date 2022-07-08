import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ThemeType } from './types';

export interface IApplicationState {
  readonly theme: ThemeType;
}

const initialState: IApplicationState = {
  theme: 'dark',
};

const ApplicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = ApplicationSlice.actions;

export default ApplicationSlice.reducer;
