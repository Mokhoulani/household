import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, ThemeState } from './state';

const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    setColorMode: (state, action: PayloadAction<ThemeState>) => {
      state.colorMode = action.payload.colorMode;
    },
  },
});

export const { setColorMode } = themeSlice.actions;
export default themeSlice.reducer;
