import { DrawerScreenProps } from '@react-navigation/drawer';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerParamList } from '../navigators/DrawerNavigator';
import { RootStackParamList } from '../navigators/RootStackNavigator';
import { TabAuthParamsList } from '../navigators/TopTabsNavigatorAuth';
import { logout } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'logout'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    MaterialTopTabScreenProps<TabAuthParamsList>
  >
>;

const colors = {
  background: '#fff',
};

export default function LogoutScreen({
  navigation,
}: Pick<Props, 'navigation'>) {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      // Optionally, navigate to login screen or show a success message
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, show an error message to the user
    }
  };

  const navigateToAuth = () => {
    navigation.navigate('AuthNavigator', {
      screen: 'signUp', // Assuming 'Login' is a screen in your AuthNavigator
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <View style={styles.spacer} />
      <Button title="Go to Login" onPress={navigateToAuth} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 20,
  },
});
