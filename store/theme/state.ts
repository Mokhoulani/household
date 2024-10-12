import { AppTheme, combinedLightTheme } from '../../themes/theme';

export type ColorMode = 'light' | 'dark' | 'auto';

export type ThemeState = {
  colorMode: ColorMode;
  appTheme: AppTheme;
};

export const initialState: ThemeState = {
  colorMode: 'auto',
  appTheme: combinedLightTheme,
};
