import { useColorScheme } from 'react-native';
import { useAppSelector } from '../hook';
import { selectColorMode } from './selectors';

// Custom hook to determine the StatusBar style
export const useStatusBarStyle = () => {
  const colorMode = useAppSelector(selectColorMode); // Redux state value
  const systemColorScheme = useColorScheme(); // System dark/light mode

  if (colorMode === 'auto') {
    return systemColorScheme === 'dark' ? 'light-content' : 'dark-content';
  }

  return colorMode === 'dark' ? 'light-content' : 'dark-content';
};
