/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';

export type DrawerParamList = {
  ProfileTab: NavigatorScreenParams<TabParamsList>;
  HomeTab: NavigatorScreenParams<TabParamsList>;
  SearchTab: NavigatorScreenParams<TabParamsList>;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: (props) => (
          <MaterialIcons
            style={{ marginRight: 16 }}
            name="login"
            size={24}
            color={props.tintColor}
            onPress={() => navigation.navigate('Singin')}
          />
        ),
      })}>
      <Drawer.Screen
        name="ProfileTab"
        component={TopTabsNavigator}
        options={({ navigation }) => ({
          title: '',
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="person"
              size={24}
              onPress={() => navigation.navigate('Profile')}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="HomeTab"
        component={TopTabsNavigator}
        options={({ navigation }) => ({
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="settings"
              size={24}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
