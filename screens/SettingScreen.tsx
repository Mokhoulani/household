import { ScrollView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { setAppTheme, setColorMode } from '../store/theme/reducer';
import { selectColorMode } from '../store/theme/selectors';
import { combinedDarkTheme, combinedLightTheme } from '../themes/theme';

export default function SettingsScreen() {
  const colorMode = useAppSelector(selectColorMode);
  const dispatch = useAppDispatch();

  const handleValueChange = (value: 'light' | 'dark' | 'auto') => {
    dispatch(setColorMode(value));

    // Define your themes (this assumes you have `combinedLightTheme` and `combinedDarkTheme` defined)
    let themeToSet;

    if (value === 'light') {
      themeToSet = combinedLightTheme; // Assume this is defined somewhere
    } else if (value === 'dark') {
      themeToSet = combinedDarkTheme; // This seems to be defined already
    } else {
      themeToSet = combinedLightTheme; // Assume you have an auto theme or set to a default theme
    }

    dispatch(setAppTheme(themeToSet));
  };
  return (
    <ScrollView contentContainerStyle={s.container}>
      <SegmentedButtons
        value={colorMode}
        onValueChange={handleValueChange as any}
        buttons={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'auto', label: 'Auto' },
        ]}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
});
