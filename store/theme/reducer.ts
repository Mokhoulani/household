import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppTheme } from '../../themes/theme';
import { ColorMode, initialState } from './state';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorMode: (state, action: PayloadAction<ColorMode>) => {
      state.colorMode = action.payload;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.appTheme = action.payload;
    },
  },
});

export const { setColorMode, setAppTheme } = themeSlice.actions;
export default themeSlice.reducer;
