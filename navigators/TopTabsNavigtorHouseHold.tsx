import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CreateHouseholdSceen from '../screens/CreateHousholdScreen';
import HomeScreen from '../screens/HomeScreen';
import JoinHouseholdScreen from '../screens/JoinHouseholdScreen';

export type TabHouseholdParamsList = {
  DetailsHousehold: undefined;
  CreateHousehold: undefined;
  JoinHousehold: undefined;
};

const Tab = createMaterialTopTabNavigator<TabHouseholdParamsList>();

export default function TopTabsNavigatorHousehold() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DetailsHousehold" component={HomeScreen} />
      <Tab.Screen name="CreateHousehold" component={CreateHouseholdSceen} />
      <Tab.Screen name="JoinHousehold" component={JoinHouseholdScreen} />
    </Tab.Navigator>
  );
}
