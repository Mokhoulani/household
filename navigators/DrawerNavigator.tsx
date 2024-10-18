/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import SettingsScreen from '../screens/SettingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';

export type DrawerParamList = {
  Hoursehold: NavigatorScreenParams<TabParamsList>;
  Profile: undefined;
  Settings: undefined;
  SignUp: undefined;
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
        name="Hoursehold"
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
        name="SignUp"
        component={SignUpScreen}
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
        name="Settings"
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
