/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import SettingsScreen from '../screens/SettingScreen';
import TopTabsNavigatorAuth, {
  TabAuthParamsList,
} from './TopTabsNavigatorAuth';

export type DrawerAuthParamList = {
  HouseholdAuth: NavigatorScreenParams<TabAuthParamsList>;
  Profile: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerAuthParamList>();

export default function DrawerAuthNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: (props) => (
          <MaterialIcons
            style={{ marginRight: 16 }}
            name="login"
            size={24}
            color={props.tintColor}
            onPress={() => navigation.navigate('logout')}
          />
        ),
      })}>
      <Drawer.Screen
        name="HouseholdAuth"
        component={TopTabsNavigatorAuth}
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
