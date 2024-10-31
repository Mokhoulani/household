import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useWindowDimensions } from 'react-native';
import SignInScreen from '../screens/SignInScreen';
import SignupScreen from '../screens/SignUpScreen';

export type TabAuthParamsList = {
  signIn: undefined;
  signUp: undefined;
};

const Tab = createMaterialTopTabNavigator<TabAuthParamsList>();

export default function TopTabsNavigatorAuth() {
  const { width } = useWindowDimensions();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#007AFF',
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarPressColor: '#E9E9E9',
        tabBarScrollEnabled: width < 768,
        lazy: true,
        lazyPlaceholder: () => null,
      }}>
      <Tab.Screen name="signUp" component={SignupScreen} />
      <Tab.Screen name="signIn" component={SignInScreen} />
    </Tab.Navigator>
  );
}
