export type AvatarThemeColors = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
};
export const avatarThemes: Record<
  number,
  { light: AvatarThemeColors; dark: AvatarThemeColors }
> = {
  0: {
    light: {
      primary: 'rgb(255, 255, 255)',
      onPrimary: 'rgb(0, 0, 0)',
      primaryContainer: 'rgb(245, 245, 245)',
      onPrimaryContainer: 'rgb(30, 30, 30)',
      secondary: 'rgb(240, 240, 240)',
      onSecondary: 'rgb(0, 0, 0)',
      secondaryContainer: 'rgb(235, 235, 235)',
      onSecondaryContainer: 'rgb(30, 30, 30)',
      tertiary: 'rgb(230, 230, 230)',
      onTertiary: 'rgb(0, 0, 0)',
      tertiaryContainer: 'rgb(225, 225, 225)',
      onTertiaryContainer: 'rgb(30, 30, 30)',
    },
    dark: {
      primary: 'rgb(230, 230, 230)',
      onPrimary: 'rgb(30, 30, 30)',
      primaryContainer: 'rgb(255, 255, 255)',
      onPrimaryContainer: 'rgb(0, 0, 0)',
      secondary: 'rgb(220, 220, 220)',
      onSecondary: 'rgb(30, 30, 30)',
      secondaryContainer: 'rgb(240, 240, 240)',
      onSecondaryContainer: 'rgb(0, 0, 0)',
      tertiary: 'rgb(210, 210, 210)',
      onTertiary: 'rgb(30, 30, 30)',
      tertiaryContainer: 'rgb(235, 235, 235)',
      onTertiaryContainer: 'rgb(0, 0, 0)',
    },
  },
  1: {
    light: {
      primary: 'rgb(255, 140, 0)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(255, 231, 204)',
      onPrimaryContainer: 'rgb(51, 28, 0)',
      secondary: 'rgb(255, 160, 40)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(255, 236, 217)',
      onSecondaryContainer: 'rgb(51, 32, 0)',
      tertiary: 'rgb(255, 180, 80)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(255, 241, 230)',
      onTertiaryContainer: 'rgb(51, 36, 0)',
    },
    dark: {
      primary: 'rgb(255, 200, 140)',
      onPrimary: 'rgb(51, 28, 0)',
      primaryContainer: 'rgb(255, 140, 0)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(255, 220, 180)',
      onSecondary: 'rgb(51, 32, 0)',
      secondaryContainer: 'rgb(255, 160, 40)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(255, 230, 200)',
      onTertiary: 'rgb(51, 36, 0)',
      tertiaryContainer: 'rgb(255, 180, 80)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  2: {
    light: {
      primary: 'rgb(128, 128, 128)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(230, 230, 230)',
      onPrimaryContainer: 'rgb(30, 30, 30)',
      secondary: 'rgb(140, 140, 140)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(235, 235, 235)',
      onSecondaryContainer: 'rgb(35, 35, 35)',
      tertiary: 'rgb(150, 150, 150)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(240, 240, 240)',
      onTertiaryContainer: 'rgb(40, 40, 40)',
    },
    dark: {
      primary: 'rgb(200, 200, 200)',
      onPrimary: 'rgb(30, 30, 30)',
      primaryContainer: 'rgb(128, 128, 128)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(210, 210, 210)',
      onSecondary: 'rgb(35, 35, 35)',
      secondaryContainer: 'rgb(140, 140, 140)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(220, 220, 220)',
      onTertiary: 'rgb(40, 40, 40)',
      tertiaryContainer: 'rgb(150, 150, 150)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  3: {
    light: {
      primary: 'rgb(128, 0, 128)', // Deep purple
      onPrimary: 'rgb(255, 255, 255)', // White for contrast
      primaryContainer: 'rgb(155, 89, 182)', // Lighter purple
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(102, 51, 153)', // Rich purple
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(153, 102, 204)', // Softer purple
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(186, 85, 211)', // Orchid purple
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(221, 160, 221)', // Lavender purple
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
    dark: {
      primary: 'rgb(200, 162, 200)', // Soft light purple for dark mode
      onPrimary: 'rgb(45, 0, 45)', // Dark purple for contrast
      primaryContainer: 'rgb(75, 0, 130)', // Indigo-purple
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(177, 156, 217)', // Muted lavender
      onSecondary: 'rgb(55, 0, 55)',
      secondaryContainer: 'rgb(138, 43, 226)', // Bright indigo
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(230, 190, 250)', // Light lilac
      onTertiary: 'rgb(55, 0, 55)',
      tertiaryContainer: 'rgb(139, 0, 139)', // Dark magenta
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  4: {
    light: {
      primary: 'rgb(255, 105, 180)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(255, 228, 241)',
      onPrimaryContainer: 'rgb(51, 21, 36)',
      secondary: 'rgb(255, 130, 190)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(255, 235, 245)',
      onSecondaryContainer: 'rgb(51, 26, 38)',
      tertiary: 'rgb(255, 155, 200)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(255, 242, 249)',
      onTertiaryContainer: 'rgb(51, 31, 40)',
    },
    dark: {
      primary: 'rgb(255, 182, 214)',
      onPrimary: 'rgb(51, 21, 36)',
      primaryContainer: 'rgb(255, 105, 180)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(255, 200, 225)',
      onSecondary: 'rgb(51, 26, 38)',
      secondaryContainer: 'rgb(255, 130, 190)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(255, 218, 236)',
      onTertiary: 'rgb(51, 31, 40)',
      tertiaryContainer: 'rgb(255, 155, 200)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  5: {
    light: {
      primary: 'rgb(34, 139, 34)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(220, 255, 220)',
      onPrimaryContainer: 'rgb(7, 28, 7)',
      secondary: 'rgb(46, 149, 46)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(225, 255, 225)',
      onSecondaryContainer: 'rgb(9, 30, 9)',
      tertiary: 'rgb(58, 159, 58)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(230, 255, 230)',
      onTertiaryContainer: 'rgb(12, 32, 12)',
    },
    dark: {
      primary: 'rgb(150, 255, 150)',
      onPrimary: 'rgb(7, 28, 7)',
      primaryContainer: 'rgb(34, 139, 34)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(170, 255, 170)',
      onSecondary: 'rgb(9, 30, 9)',
      secondaryContainer: 'rgb(46, 149, 46)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(190, 255, 190)',
      onTertiary: 'rgb(12, 32, 12)',
      tertiaryContainer: 'rgb(58, 159, 58)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  6: {
    light: {
      primary: 'rgb(30, 144, 255)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(219, 238, 255)',
      onPrimaryContainer: 'rgb(6, 29, 51)',
      secondary: 'rgb(65, 163, 255)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(224, 241, 255)',
      onSecondaryContainer: 'rgb(13, 33, 51)',
      tertiary: 'rgb(100, 182, 255)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(229, 244, 255)',
      onTertiaryContainer: 'rgb(20, 36, 51)',
    },
    dark: {
      primary: 'rgb(173, 216, 255)',
      onPrimary: 'rgb(6, 29, 51)',
      primaryContainer: 'rgb(30, 144, 255)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(190, 225, 255)',
      onSecondary: 'rgb(13, 33, 51)',
      secondaryContainer: 'rgb(65, 163, 255)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(207, 234, 255)',
      onTertiary: 'rgb(20, 36, 51)',
      tertiaryContainer: 'rgb(100, 182, 255)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  7: {
    light: {
      primary: 'rgb(220, 20, 60)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(255, 218, 218)',
      onPrimaryContainer: 'rgb(51, 4, 12)',
      secondary: 'rgb(230, 30, 70)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(255, 223, 223)',
      onSecondaryContainer: 'rgb(51, 6, 14)',
      tertiary: 'rgb(240, 40, 80)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(255, 228, 228)',
      onTertiaryContainer: 'rgb(51, 8, 16)',
    },
    dark: {
      primary: 'rgb(255, 150, 150)',
      onPrimary: 'rgb(51, 4, 12)',
      primaryContainer: 'rgb(220, 20, 60)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(255, 170, 170)',
      onSecondary: 'rgb(51, 6, 14)',
      secondaryContainer: 'rgb(230, 30, 70)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(255, 190, 190)',
      onTertiary: 'rgb(51, 8, 16)',
      tertiaryContainer: 'rgb(240, 40, 80)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
  8: {
    light: {
      primary: 'rgb(139, 69, 19)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(255, 235, 220)',
      onPrimaryContainer: 'rgb(28, 14, 4)',
      secondary: 'rgb(149, 79, 29)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(255, 240, 225)',
      onSecondaryContainer: 'rgb(30, 16, 6)',
      tertiary: 'rgb(159, 89, 39)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(255, 245, 230)',
      onTertiaryContainer: 'rgb(32, 18, 8)',
    },
    dark: {
      primary: 'rgb(210, 180, 150)',
      onPrimary: 'rgb(28, 14, 4)',
      primaryContainer: 'rgb(139, 69, 19)',
      onPrimaryContainer: 'rgb(255, 255, 255)',
      secondary: 'rgb(220, 190, 160)',
      onSecondary: 'rgb(30, 16, 6)',
      secondaryContainer: 'rgb(149, 79, 29)',
      onSecondaryContainer: 'rgb(255, 255, 255)',
      tertiary: 'rgb(230, 200, 170)',
      onTertiary: 'rgb(32, 18, 8)',
      tertiaryContainer: 'rgb(159, 89, 39)',
      onTertiaryContainer: 'rgb(255, 255, 255)',
    },
  },
};
