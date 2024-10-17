import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignInScreen from '../screens/SignInScreen';
import SignupScreen from '../screens/SignUpScreen';

export type TabAuthParamsList = {
  signIn: undefined;
  signUp: undefined;
};

const Tab = createMaterialTopTabNavigator<TabAuthParamsList>();

export default function TopTabsNavigatorAuth() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="signUp" component={SignupScreen} />
      <Tab.Screen name="signIn" component={SignInScreen} />
    </Tab.Navigator>
  );
}
