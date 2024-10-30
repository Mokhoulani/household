export type ColorMode = 'light' | 'dark' | 'auto';

export type ThemeState = {
  colorMode: ColorMode;
  avatarTheme: number;
};

export const initialState: ThemeState = {
  colorMode: 'auto',
  avatarTheme: 0,
};
