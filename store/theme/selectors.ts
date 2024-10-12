import { RootState } from '../store';
// Selector to get the entire theme state
export const selectThemeState = (state: RootState) => state.theme;

// Selector to get the color mode from the theme state
export const selectColorMode = (state: RootState) => state.theme.colorMode;
