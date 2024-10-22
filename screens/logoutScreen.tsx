import { DrawerScreenProps } from '@react-navigation/drawer';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerAuthParamList } from '../navigators/DrawerNavigatorAuth';
import { RootStackParamList } from '../navigators/RootStackNavigator';
import { TabAuthParamsList } from '../navigators/TopTabsNavigatorAuth';
import { logout } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'logout'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerAuthParamList>,
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

      // Reset navigation stack to the AuthNavigator after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthNavigator' }], // Ensure 'AuthNavigator' is correct
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'There was a problem logging you out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <View style={styles.spacer} />
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
    marginVertical: 10,
  },
});
