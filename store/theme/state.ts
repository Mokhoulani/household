export type ColorMode = 'light' | 'dark' | 'auto';

export type ThemeState = {
  colorMode: ColorMode;
};

export const initialState: ThemeState = {
  colorMode: 'auto',
};
