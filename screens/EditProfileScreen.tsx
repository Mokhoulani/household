import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
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
import { globalStyles } from '../themes/styles';
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
      console.error('Missing required profile data');
      return;
    }

    if (!selectedAvatarId || selectedAvatarId === 0) {
      // Add explicit check for 0
      Alert.alert('Error', 'Please select an avatar');
      return;
    }

    try {
      await dispatch(
        approveJoinRequest({
          id: profile.id,
          name: name.trim(), // Use the current name state
          isOwner: profile.isOwner,
          isRequest: false,
          householdId: profile.household.id,
          accountId: profile.accountId,
          avatarId: selectedAvatarId, // Use the selected avatar ID
          household: null,
          Account: null,
        }),
      );
      navigation.navigate('Dashboard');
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  if (!profile) {
    return (
      <View style={globalStyles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Edit Profile</Text>

        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={globalStyles.input}
        />

        <Text style={globalStyles.subtitle}>Select an Avatar</Text>

        <View style={globalStyles.avatarGrid}>
          {avatars?.length > 0 ? (
            avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  globalStyles.avatarContainer,
                  selectedAvatarId === avatar.id && globalStyles.selectedAvatar,
                ]}
                onPress={() => handleAvatarSelect(avatar)}>
                <Text style={globalStyles.avatarIcon}>{avatar.icon}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={globalStyles.noAvatarText}>
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

        {error && <Text style={globalStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
