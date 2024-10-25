import { DrawerScreenProps } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
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
      // Add null check
      dispatch(selectAvatarId(avatar.id));
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
          HouseholdId: householdId,
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
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid household selection</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Create Profile</Text>

        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.subtitle}>Select an Avatar</Text>

        <View style={styles.avatarGrid}>
          {avatars.length > 0 ? (
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
            title="Create Profile"
            onPress={handleSubmit}
            disabled={!isFormValid}
          />
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
