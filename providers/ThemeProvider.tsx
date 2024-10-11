import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, PropsWithChildren, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { combinedDarkTheme, combinedLightTheme } from '../theme';

interface ContextValue {
  colorMode: 'light' | 'dark' | 'auto';
  setColorMode: (value: 'light' | 'dark' | 'auto') => void;
}

export const ThemeContext = createContext({} as ContextValue);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'auto'>('auto');

  const theme =
    colorMode === 'dark' || (colorMode === 'auto' && colorScheme === 'dark')
      ? combinedDarkTheme
      : combinedLightTheme;

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      <StatusBar
        style={
          colorMode === 'light'
            ? 'light'
            : colorMode === 'dark'
              ? 'light'
              : 'auto'
        }
      />
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
