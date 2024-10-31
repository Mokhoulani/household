/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import SelectHousehold from '../components/SelectHousehold';
import CreateTaskView from '../screens/CreateChoresScreen';
import EditTaskScreen from '../screens/EditTaskScrenn';
import TasksDetailsScreen from '../screens/TasksDetailsScreen';
import { HouseholdTask } from '../types/HouseholdTask';

export type TabChoreParamsList = {
  CreateChore: undefined;
  TasksDetails: undefined;
  EditTask: { task: HouseholdTask } | undefined;
};

const Tab = createMaterialTopTabNavigator<TabChoreParamsList>();

export default function TopTabsNavigatorChore() {
  const { width } = useWindowDimensions();
  return (
    <>
      <SelectHousehold />
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
            fontSize: 12,
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
            tabBarLabel: ({ color }) => (
              <Text
                style={{
                  color,
                }}>
                Create Chore
              </Text>
            ),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="add-home-work" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TasksDetails"
          component={TasksDetailsScreen}
          options={{
            title: 'details',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="details" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="EditTask"
          component={EditTaskScreen}
          options={{
            title: 'edit',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="add-home-work" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
