import { RootState } from '../store';

export const selectTheme = (state: RootState) => state.theme;
export const selectColorMode = (state: RootState) => state.theme.colorMode;
export const selectAppTheme = (state: RootState) => state.theme.appTheme;
