/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import DashboardProfileScreen from '../screens/DashboardProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileDetailsSceen from '../screens/ProfileDetailsScreen';
import { Profile } from '../types/profile';

export type TabProfileParamsList = {
  Dashboard: undefined;
  DetailsProfile: { profile: Profile } | undefined;
  EditProfile: { profile: Profile } | undefined;
};

const Tab = createMaterialTopTabNavigator<TabProfileParamsList>();

export default function TopTabsNavigatorProfile() {
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
        component={DashboardProfileScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DetailsProfile"
        component={ProfileDetailsSceen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="details" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="edit" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
