/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import CreateTaskView from '../screens/CreateChoresScreen';

export type TabChoreParamsList = {
  CreateChore: undefined;
};

const Tab = createMaterialTopTabNavigator<TabChoreParamsList>();

export default function TopTabsNavigatorChore() {
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
        name="CreateChore"
        component={CreateTaskView}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-home-work" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
