import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from '../navigators/RootStackNavigator';
import { useAppSelector } from '../store/hook';
import { selectAppTheme } from '../store/theme/selectors';
import { useStatusBarStyle } from '../store/theme/useStatusBarStyle';

export default function MainApp() {
  const appTheme = useAppSelector(selectAppTheme); // Get the theme from Redux
  const statusBarStyle = useStatusBarStyle(); // Get the status bar style from the custom hook

  return (
    <>
      {/* Correct usage of StatusBar with the barStyle prop */}
      <StatusBar barStyle={statusBarStyle} />

      {/* Use PaperProvider and NavigationContainer with the theme from Redux */}
      <PaperProvider theme={appTheme}>
        <NavigationContainer theme={appTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}
