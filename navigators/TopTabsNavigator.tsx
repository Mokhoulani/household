/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import DailyViewScreen from '../screens/DailyViewScreen';

import StatisticsScreen from '../screens/StatisticsScreen';
export type TabParamsList = {
  Today: undefined;
  Statistics: { period: string };
};

const Tab = createMaterialTopTabNavigator<TabParamsList>();

export default function TopTabsNavigator() {
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
        name="Today"
        component={DailyViewScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="today" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="work-history" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
