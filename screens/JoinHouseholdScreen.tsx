import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hook';

import { addJoinRequest } from '../store/households/action';
import {
  selectHouseholdError,
  selectHouseholdLoading,
} from '../store/households/selectors';
import { selectCurrentProfile } from '../store/profiles/selectors';

export default function JoinHouseholdScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState('');

  const isLoading = useSelector(selectHouseholdLoading);
  const error = useSelector(selectHouseholdError);
  const currentProfile = useSelector(selectCurrentProfile); // Get the current user's profile

  const handleSubmit = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter the household join code');
      return;
    }

    // Simulated household data (replace with real API check in production)
    const household = {
      id: 1,
      name: 'Sample Household',
      joinCode: 'ABC123',
    };

    if (joinCode.trim() === household.joinCode) {
      try {
        await dispatch(addJoinRequest()).unwrap(); // Wait for the action to complete successfully

        Alert.alert(
          'Request Sent',
          'Your request to join the household has been sent. You will be notified when it is approved.',
          [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }],
        );
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to send join request');
      }
    } else {
      Alert.alert('Error', 'Invalid join code');
    }
  };

  return (
    <View>
      <Text>Join a Household</Text>

      <TextInput
        placeholder="Enter Join Code"
        value={joinCode}
        onChangeText={setJoinCode}
        autoCapitalize="characters"
      />

      <TextInput
        placeholder="Add a message (optional)"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Send Join Request" onPress={handleSubmit} />
      )}

      {error && <Text>{error}</Text>}
    </View>
  );
}
