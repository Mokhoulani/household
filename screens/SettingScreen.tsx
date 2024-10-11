import { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { ThemeContext } from '../providers/ThemeProvider';

export default function SettingsScreen() {
  const { colorMode, setColorMode } = useContext(ThemeContext);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <SegmentedButtons
        value={colorMode}
        onValueChange={setColorMode as any}
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
