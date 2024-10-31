import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  Theme,
} from '@react-navigation/native';
import {
  adaptNavigationTheme,
  MD2Colors,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import { avatarThemes } from './avatarTheme';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export type AppTheme = ThemeProp & Theme;

export const combinedLightTheme: AppTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  ...MD2Colors,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(29, 27, 30)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(29, 27, 30)',
    surfaceVariant: 'rgb(233, 223, 235)',
    onSurfaceVariant: 'rgb(74, 69, 78)',
    outline: 'rgb(124, 117, 126)',
    outlineVariant: 'rgb(204, 196, 206)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(50, 47, 51)',
    inverseOnSurface: 'rgb(245, 239, 244)',
    inversePrimary: 'rgb(220, 184, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(248, 242, 251)',
      level2: 'rgb(244, 236, 248)',
      level3: 'rgb(240, 231, 246)',
      level4: 'rgb(239, 229, 245)',
      level5: 'rgb(236, 226, 243)',
    },
    surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
    backdrop: 'rgba(51, 47, 55, 0.4)',
  },
};

export const combinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  ...MD2Colors,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(29, 27, 30)',
    onBackground: 'rgb(231, 225, 229)',
    surface: 'rgb(29, 27, 30)',
    onSurface: 'rgb(231, 225, 229)',
    surfaceVariant: 'rgb(74, 69, 78)',
    onSurfaceVariant: 'rgb(204, 196, 206)',
    outline: 'rgb(150, 142, 152)',
    outlineVariant: 'rgb(74, 69, 78)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(231, 225, 229)',
    inverseOnSurface: 'rgb(50, 47, 51)',
    inversePrimary: 'rgb(120, 69, 172)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(39, 35, 41)',
      level2: 'rgb(44, 40, 48)',
      level3: 'rgb(50, 44, 55)',
      level4: 'rgb(52, 46, 57)',
      level5: 'rgb(56, 49, 62)',
    },
    surfaceDisabled: 'rgba(231, 225, 229, 0.12)',
    onSurfaceDisabled: 'rgba(231, 225, 229, 0.38)',
    backdrop: 'rgba(51, 47, 55, 0.4)',
  },
} satisfies AppTheme;

export const getCombinedTheme = (avatarTheme: number, isDark: boolean) => {
  const baseTheme = isDark ? combinedDarkTheme : combinedLightTheme;
  const avatarColors = avatarThemes[avatarTheme][isDark ? 'dark' : 'light'];

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: avatarColors.primary,
      onPrimary: avatarColors.onPrimary,
      primaryContainer: avatarColors.primaryContainer,
      onPrimaryContainer: avatarColors.onPrimaryContainer,
      secondary: avatarColors.secondary,
      onSecondary: avatarColors.onSecondary,
      secondaryContainer: avatarColors.secondaryContainer,
      onSecondaryContainer: avatarColors.onSecondaryContainer,
      tertiary: avatarColors.tertiary,
      onTertiary: avatarColors.onTertiary,
      tertiaryContainer: avatarColors.tertiaryContainer,
      onTertiaryContainer: avatarColors.onTertiaryContainer,
    },
  };
};
