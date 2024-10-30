import { RootState } from '../store';

export const selectThemeState = (state: RootState) => state.theme;

export const selectColorMode = (state: RootState) => state.theme.colorMode;

export const selectAvatarTheme = (state: RootState) => state.theme.avatarTheme;
