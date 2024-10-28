import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/DailyViewScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

export type TabParamsList = {
  Today: undefined;
  Statistics: { period: string };
};

const Tab = createMaterialTopTabNavigator<TabParamsList>();

export default function TopTabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
}
