/* eslint-disable react/no-unstable-nested-components */
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import CreateHouseholdSceen from '../screens/CreateHousholdScreen';

import DashboardScreen from '../screens/DashboardHouseholdScreen';
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
          fontSize: 0,
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
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DetailsHousehold"
        component={HouseholdDetailsScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="details" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateHousehold"
        component={CreateHouseholdSceen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-business" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="JoinHousehold"
        component={JoinHouseholdScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <AntDesign name="adduser" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
