import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DashboardProfileScreen from '../screens/DashboardProfileScreen';
import HomeScreen from '../screens/HomeScreen';

export type TabProfileParamsList = {
  Dashboard: undefined;
  DetailsProfile: undefined;
  EditProfile: undefined;
};

const Tab = createMaterialTopTabNavigator<TabProfileParamsList>();

export default function TopTabsNavigatorProfile() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardProfileScreen} />
      <Tab.Screen name="DetailsProfile" component={HomeScreen} />
      <Tab.Screen name="EditProfile" component={HomeScreen} />
    </Tab.Navigator>
  );
}
