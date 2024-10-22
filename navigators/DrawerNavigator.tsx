/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import CreateProfileScreen from '../screens/CreateprofileScreen';
import SettingsScreen from '../screens/SettingScreen';
import { Household } from '../types/Household';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';
import TopTabsNavigatorProfile, {
  TabProfileParamsList,
} from './TopTabsNavigatorProfile';
import TopTabsNavigatorHousehold, {
  TabHouseholdParamsList,
} from './TopTabsNavigtorHouseHold';

export type DrawerParamList = {
  TodyView: NavigatorScreenParams<TabParamsList>;
  Household: NavigatorScreenParams<TabHouseholdParamsList>;
  Profile: NavigatorScreenParams<TabProfileParamsList>;
  Settings: undefined;
  CreateProfile: { household: Household | null };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      // initialRouteName="CraeteProfile"
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
        name="TodyView"
        component={TopTabsNavigator}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <MaterialIcons style={{ marginRight: 16 }} name="work" size={24} />
          ),
        })}
      />
      <Drawer.Screen
        name="Household"
        component={TopTabsNavigatorHousehold}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <MaterialIcons style={{ marginRight: 16 }} name="house" size={24} />
          ),
        })}
      />
      <Drawer.Screen
        name="Profile"
        component={TopTabsNavigatorProfile}
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
      <Drawer.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={() => ({
          drawerLabel: () => null,
        })}
      />
    </Drawer.Navigator>
  );
}
