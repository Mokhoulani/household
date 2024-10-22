/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';
import LogoutScreen from '../screens/logoutScreen';

export type DrawerParamList = {
  Hoursehold: NavigatorScreenParams<TabParamsList>;
  Profile: undefined;
  signout:undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: (props) => (
          <MaterialIcons
            style={{ marginRight: 16 }}
            name="settings"
            size={24}
            color={props.tintColor}
            onPress={() => navigation.navigate('settings')}
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
        name="signout"
        component={LogoutScreen}
        options={() => ({
          drawerLabel: () => (
            <MaterialIcons
              style={{ marginRight: 16 }}
              name="logout"
              size={24}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
