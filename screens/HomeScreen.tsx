import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const colors = {
  background: '#fff',
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Home screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
