import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

const colors = {
  background: '#fff',
};

export default function LogoutScreen() {
  const dispatch = useAppDispatch();

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
