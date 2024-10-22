import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';

export type TabProfileParamsList = {
  DetailsProfile: undefined;
  EditProfile: undefined;
};

const Tab = createMaterialTopTabNavigator<TabProfileParamsList>();

export default function TopTabsNavigatorProfile() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DetailsProfile" component={HomeScreen} />
      <Tab.Screen name="EditProfile" component={HomeScreen} />
    </Tab.Navigator>
  );
}
