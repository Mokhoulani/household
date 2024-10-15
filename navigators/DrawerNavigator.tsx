/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import SettingsScreen from '../screens/SettingScreen';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';

export type DrawerParamList = {
  HomeTab: NavigatorScreenParams<TabParamsList>;
  Profile: undefined;
  Settings: undefined;
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
            onPress={() => navigation.navigate('signIn')}
          />
        ),
      })}>
      <Drawer.Screen
        name="Profile"
        component={TopTabsNavigator}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="person"
              size={24}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="HomeTab"
        component={SettingsScreen}
        options={() => ({
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="settings"
              size={24}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
