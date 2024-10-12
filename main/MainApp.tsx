import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from '../navigators/RootStackNavigator';
import { useAppSelector } from '../store/hook';
import { selectColorMode } from '../store/theme/selectors';
import { combinedDarkTheme, combinedLightTheme } from '../themes/theme';

export default function MainApp() {
  const colorMode = useAppSelector(selectColorMode); // Get the theme from Redux
  console.log(colorMode); // Log the theme to the console
  const colorScheme = useColorScheme();
  console.log(colorScheme); // Log the color scheme to the console

  const theme =
    colorMode === 'dark' || (colorMode === 'auto' && colorScheme === 'dark')
      ? combinedDarkTheme
      : combinedLightTheme;

  return (
    <>
      {/* Correct usage of StatusBar with the barStyle prop */}
      <StatusBar
        style={
          colorMode === 'light'
            ? 'light'
            : colorMode === 'dark'
              ? 'light'
              : 'auto'
        }
      />

      {/* Use PaperProvider and NavigationContainer with the theme from Redux */}
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}
