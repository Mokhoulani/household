import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Alert, Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';
import { useGlobalStyles } from '../themes/styles';

export default function LogoutScreen() {
  const dispatch = useAppDispatch();
  const globalStyles = useGlobalStyles();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthNavigator' }], // Replace with the correct name of your auth navigator
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'There was a problem logging you out.');
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <View style={globalStyles.spacer} />
    </SafeAreaView>
  );
}
