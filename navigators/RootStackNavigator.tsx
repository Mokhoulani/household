import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useSplashScreen } from '../hooks/useSplashScreen'; // Import your custom hook
import SplashScreen from '../screens/SplashScreen'; // Import your splash screen
import { selectIsAuthenticated } from '../store/auth/selectors';
import { useAppSelector } from '../store/hook';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import TopTabsNavigatorAuth, {
  TabAuthParamsList,
} from './TopTabsNavigatorAuth';

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  AuthNavigator: NavigatorScreenParams<TabAuthParamsList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isLoading, onLayoutRootView } = useSplashScreen(); // Use the custom hook

  if (isLoading) {
    return <SplashScreen />; // Show splash screen while loading
  }

  return (
    <View style={styles.flex} onLayout={onLayoutRootView}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
        ) : (
          <RootStack.Screen
            name="AuthNavigator"
            component={TopTabsNavigatorAuth}
          />
        )}
      </RootStack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
