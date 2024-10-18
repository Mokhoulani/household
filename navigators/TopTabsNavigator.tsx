import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';

export type TabParamsList = {
  Today: undefined;
  Statistics: { period: string };
};

const Tab = createMaterialTopTabNavigator<TabParamsList>();

export default function TopTabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={HomeScreen} />
    </Tab.Navigator>
  );
}
