import RootStackNavigator from './navigators/RootStackNavigator';
import ThemeProvider from './providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <RootStackNavigator />
    </ThemeProvider>
  );
}
