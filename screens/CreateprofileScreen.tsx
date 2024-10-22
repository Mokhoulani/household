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
import { getAvailableAvatarsForProfile } from '../store/avatars/reducer';
import { useAppDispatch } from '../store/hook';
import { createProfile } from '../store/profiles/action';
import { RootState } from '../store/store';
import { combinedLightTheme } from '../themes/theme';
import { Avatar } from '../types/Avatar';

type Props = DrawerScreenProps<DrawerParamList, 'CreateProfile'>;

export default function CreateProfileScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const householdId = route.params.household?.id;

  const isLoading = useSelector((state: RootState) => state.profiles.isLoading);
  const error = useSelector((state: RootState) => state.profiles.error);

  // Get all available avatars
  const allAvatars = useSelector((state: RootState) =>
    getAvailableAvatarsForProfile(state),
  );

  // Get currently selected avatars in the household
  const selectedAvatars = useSelector(
    (state: RootState) => state.avatars.selectedAvatars,
  );

  // Filter out already selected avatars
  const availableAvatars = allAvatars.filter(
    (avatar) =>
      !selectedAvatars.some((selected) => selected.avatarId === avatar.id),
  );

  useEffect(() => {
    if (!householdId) {
      Alert.alert('Error', 'No household selected', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [householdId, navigation]);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatarId(avatar.id);
  };

  const handleSubmit = () => {
    if (!name || !selectedAvatarId || !householdId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    dispatch(
      createProfile({
        name,
        AvatarId: selectedAvatarId,
        isOwner: true,
        isRequest: true,
        HouseholdId: householdId,
      }),
    )
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.error('Error creating profile:', err);
        Alert.alert('Error', 'Failed to create profile');
      });
  };

  const isFormValid =
    name.trim() !== '' &&
    selectedAvatarId !== null &&
    householdId !== undefined &&
    availableAvatars.length > 0;

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
          {availableAvatars.length > 0 ? (
            availableAvatars.map((avatar) => (
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
            <Text style={styles.avatarContainer}>
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
});
