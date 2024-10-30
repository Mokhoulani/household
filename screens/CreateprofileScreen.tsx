import { DrawerScreenProps } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DrawerParamList } from '../navigators/DrawerNavigator';
import { getAvailableAvatarsForProfile } from '../store/avatars/action';
import { clearSelectedAvatar, selectAvatarId } from '../store/avatars/reducer';

import {
  selectAvailableAvatars,
  selectAvatarsError,
  selectAvatarsLoading,
  selectSelectedAvatarId,
} from '../store/avatars/selectors';
import { useAppDispatch } from '../store/hook';
import { createProfile } from '../store/profiles/action';
import { setAvatarTheme } from '../store/theme/reducer';
import { useGlobalStyles } from '../themes/styles';
import { combinedLightTheme } from '../themes/theme';
import { Avatar } from '../types/Avatar';

type Props = DrawerScreenProps<DrawerParamList, 'CreateProfile'>;

export default function CreateProfileScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const householdId = route.params.createProfile.id;
  const isOwner = route.params.createProfile.isOwner;
  const isRequest = route.params.createProfile.isRequest;

  // Use Redux state instead of local state for selectedAvatarId
  const selectedAvatarId = useSelector(selectSelectedAvatarId);
  const avatars = useSelector(selectAvailableAvatars);
  const isLoading = useSelector(selectAvatarsLoading);
  const error = useSelector(selectAvatarsError);
  const globalStyles = useGlobalStyles();

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
      dispatch(setAvatarTheme(avatar.id));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!selectedAvatarId || selectedAvatarId === 0) {
      // Add explicit check for 0
      Alert.alert('Error', 'Please select an avatar');
      return;
    }

    if (!householdId) {
      Alert.alert('Error', 'Invalid household selection');
      return;
    }

    try {
      await dispatch(
        createProfile({
          name: name.trim(),
          avatarId: selectedAvatarId,
          isOwner: isOwner,
          isRequest: isRequest,
          householdId: householdId,
        }),
      ).unwrap();

      navigation.goBack();
    } catch (err) {
      console.error('Error creating profile:', err);
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  const isFormValid = Boolean(
    name.trim() &&
      selectedAvatarId &&
      selectedAvatarId !== 0 && // Add explicit check for 0
      householdId &&
      avatars.length > 0,
  );

  if (!householdId) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>Invalid household selection</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Create Profile</Text>

        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={globalStyles.input}
        />

        <Text style={globalStyles.subtitle}>Select an Avatar</Text>

        <View style={globalStyles.avatarGrid}>
          {avatars.length > 0 ? (
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
            title="Create Profile"
            onPress={handleSubmit}
            disabled={!isFormValid}
          />
        )}

        {error && <Text style={globalStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
