import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import CreateHouseholdSceen from '../screens/CreateHousholdScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HouseholdDetailsScreen from '../screens/HouseholdDetailsScreen';
import JoinHouseholdScreen from '../screens/JoinHouseholdScreen';
import { Household } from '../types/Household';

export type TabHouseholdParamsList = {
  Dashboard: undefined;
  DetailsHousehold: { household: Household } | undefined;
  CreateHousehold: undefined;
  JoinHousehold: undefined;
};

const Tab = createMaterialTopTabNavigator<TabHouseholdParamsList>();

export default function TopTabsNavigatorHousehold() {
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
          textTransform: 'none',
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarPressColor: '#E9E9E9',
        tabBarScrollEnabled: width < 768,
        lazy: true,
        lazyPlaceholder: () => null,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'My Households',
        }}
      />
      <Tab.Screen
        name="DetailsHousehold"
        component={HouseholdDetailsScreen}
        options={{
          title: 'Details',
        }}
      />
      <Tab.Screen
        name="CreateHousehold"
        component={CreateHouseholdSceen}
        options={{
          title: 'Create New',
        }}
      />
      <Tab.Screen
        name="JoinHousehold"
        component={JoinHouseholdScreen}
        options={{
          title: 'Join Existing',
        }}
      />
    </Tab.Navigator>
  );
}

export function HouseholdNavigationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopTabsNavigatorHousehold />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
