/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import CreateProfileScreen from '../screens/CreateprofileScreen';
import LogoutScreen from '../screens/logoutScreen';
import SettingsScreen from '../screens/SettingScreen';
import HouseholdDetailsScreen from '../screens/HouseholdDetailsScreen';
import { Text } from 'react-native-paper';

// import { Household } from '../types/Household';

import { CreateProfile } from '../types/profile';

import TopTabsNavigatorChore, {
  TabChoreParamsList,
} from './TopTabsNavigatorChore';
import TopTabsNavigator, { TabParamsList } from './TopTabsNavigator';
import TopTabsNavigatorProfile, {
  TabProfileParamsList,
} from './TopTabsNavigatorProfile';
import TopTabsNavigatorHousehold, {
  TabHouseholdParamsList,
} from './TopTabsNavigtorHouseHold';
import { View } from 'react-native';

export type DrawerParamList = {
  TodyView: NavigatorScreenParams<TabParamsList>;
  Household: NavigatorScreenParams<TabHouseholdParamsList>;
  Profile: NavigatorScreenParams<TabProfileParamsList>;
  Chore: NavigatorScreenParams<TabChoreParamsList>;
  CreateProfile: { createProfile: CreateProfile };
  signout: undefined;
  settings: undefined;
  createTask: undefined;
  NewHousehold: NavigatorScreenParams<TabProfileParamsList>;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="TodyView"
        component={TopTabsNavigator}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <FontAwesome5 style={{ marginRight: 16 }} name="tasks" size={24} />
          ),
        })}
      />
      <Drawer.Screen
        name="Household"
        component={HouseholdDetailsScreen}
        options={() => ({
          title: '',
          drawerLabel: ({ color }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                style={{ marginRight: 16 }}
                name="house"
                size={24}
              />
              <Text style={{ color: color }}>Hushåll</Text>
            </View>
          ),
        })}
      />
      <Drawer.Screen
        name="NewHousehold"
        component={TopTabsNavigatorHousehold}
        options={() => ({
          title: '',
          drawerLabel: ({ color }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign
                name="plus"
                size={24}
                color={color}
                style={{ marginRight: 16 }}
              />
              <Text>Skapa/gå med i hushåll</Text>
            </View>
          ),
        })}
      />
      <Drawer.Screen
        name="Profile"
        component={TopTabsNavigatorProfile}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <AntDesign style={{ marginRight: 16 }} name="profile" size={24} />
          ),
        })}
      />
      <Drawer.Screen
        name="Chore"
        component={TopTabsNavigatorChore}
        options={() => ({
          title: '',
          drawerLabel: () => (
            <FontAwesome5 style={{ marginRight: 16 }} name="tasks" size={24} />
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
      <Drawer.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={() => ({
          drawerLabel: () => null,
        })}
      />
      <Drawer.Screen
        name="settings"
        component={SettingsScreen}
        options={() => ({
          drawerLabel: () => null,
        })}
      />
    </Drawer.Navigator>
  );
}
