import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useSplashScreen } from '../hooks/useSplashScreen';
import RootNavigator from '../navigators/RootStackNavigator';
import SplashScreen from '../screens/SplashScreen';
import { useAppSelector } from '../store/hook';
import { selectAvatarTheme, selectColorMode } from '../store/theme/selectors';
import { getCombinedTheme } from '../themes/theme';

export default function MainApp() {
  const colorMode = useAppSelector(selectColorMode);
  const colorScheme = useColorScheme();
  const avatarTheme = useAppSelector(selectAvatarTheme);
  const { appIsReady, onLayoutRootView } = useSplashScreen();

  const theme =
    colorMode === 'dark' || (colorMode === 'auto' && colorScheme === 'dark')
      ? getCombinedTheme(avatarTheme, true)
      : getCombinedTheme(avatarTheme, false);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
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
        <NavigationContainer theme={theme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
