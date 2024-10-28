import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { TabProfileParamsList } from '../navigators/TopTabsNavigatorProfile';
import { getAvailableAvatarsForProfile } from '../store/avatars/action';
import { clearSelectedAvatar, selectAvatarId } from '../store/avatars/reducer';
import {
  selectAvailableAvatars,
  selectAvatarsError,
  selectAvatarsLoading,
  selectSelectedAvatarId,
} from '../store/avatars/selectors';
import { useAppDispatch } from '../store/hook';
import { approveJoinRequest } from '../store/households/action';
import { combinedLightTheme } from '../themes/theme';
import { Avatar } from '../types/Avatar';

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'EditProfile'>;

export default function EditProfileScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const profile = route.params?.profile;
  console.log('EditProfileScreen', profile);
  const householdId = profile?.household?.id;
  // Add null check for initial name value
  const [name, setName] = useState(profile?.name || '');

  const selectedAvatarId = useSelector(selectSelectedAvatarId);
  const avatars = useSelector(selectAvailableAvatars);
  const isLoading = useSelector(selectAvatarsLoading);
  const error = useSelector(selectAvatarsError);

  useEffect(() => {
    if (householdId) {
      dispatch(getAvailableAvatarsForProfile({ householdId }));
    }
    return () => {
      dispatch(clearSelectedAvatar());
    };
  }, [dispatch, householdId]);

  const handleAvatarSelect = (avatar: Avatar) => {
    if (avatar.id) {
      dispatch(selectAvatarId(avatar.id));
    }
  };

  // Add null checks and proper validation
  const isFormValid = Boolean(
    name?.trim() &&
      selectedAvatarId &&
      selectedAvatarId !== 0 &&
      householdId &&
      avatars?.length > 0,
  );

  const handleSubmit = async () => {
    if (!profile || !profile.household?.id) {
      Alert.alert('Error', 'Missing required profile data');
      return;
    }

    if (!selectedAvatarId || selectedAvatarId === 0) {
      Alert.alert('Error', 'Please select an avatar');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these profile changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          style: 'default',
          onPress: async () => {
            try {
              await dispatch(
                approveJoinRequest({
                  id: profile.id,
                  name: name.trim(),
                  isOwner: profile.isOwner,
                  isRequest: profile.isRequest,
                  householdId: profile.householdId,
                  accountId: profile.accountId,
                  avatarId: selectedAvatarId,
                  household: null,
                  Account: null,
                }),
              );

              Alert.alert('Success', 'Profile updated successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Dashboard'),
                },
              ]);
              // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
            } catch (error) {
              console.error('Failed to approve request:', error);
              Alert.alert(
                'Error',
                'Failed to update profile. Please try again.',
                [{ text: 'OK' }],
              );
            } finally {
              dispatch(clearSelectedAvatar());
              setName('');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };
  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.subtitle}>Select an Avatar</Text>

        <View style={styles.avatarGrid}>
          {avatars?.length > 0 ? (
            avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarContainer,
                  selectedAvatarId === avatar.id && styles.selectedAvatar,
                ]}
                onPress={() => handleAvatarSelect(avatar)}>
                <Text style={styles.avatarIcon}>{avatar.icon}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAvatarText}>
              All avatars are currently in use
            </Text>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={combinedLightTheme.colors.primary}
          />
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isFormValid}>
            Save Changes
          </Button>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: combinedLightTheme.colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: combinedLightTheme.colors.border,
    margin: 5,
  },
  selectedAvatar: {
    borderColor: combinedLightTheme.colors.primary,
    backgroundColor: combinedLightTheme.colors.background,
  },
  avatarIcon: {
    fontSize: 30,
  },
  errorText: {
    color: combinedLightTheme.colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  noAvatarText: {
    color: combinedLightTheme.colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
});
