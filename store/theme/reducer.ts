// themeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorMode, initialState } from './state';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorMode(state, action: PayloadAction<ColorMode>) {
      state.colorMode = action.payload;
    },
    setAvatarTheme(state, action: PayloadAction<number>) {
      state.avatarTheme = action.payload;
    },
  },
});

export const { setColorMode, setAvatarTheme } = themeSlice.actions;

export default themeSlice.reducer;
