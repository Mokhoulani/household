import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Surface, Text } from 'react-native-paper';
import { TabProfileParamsList } from '../navigators/TopTabsNavigatorProfile';
import { initialAvatars } from '../store/avatars/state';
import { useAppDispatch } from '../store/hook';
import { setCurrentProfile } from '../store/profiles/reducer';
import { Profile } from '../types/profile';

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'DetailsProfile'>;

export default function ProfileDetailsScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const profile = route.params?.profile;
  const selectedAvatar = initialAvatars.find((a) => a.id === profile?.avatarId);

  // Extracted render functions for icons
  const renderLeftIcon = () => (
    <Text style={styles.avatarIcon}>{selectedAvatar?.icon}</Text>
  );
  const renderRightIcon = () => (
    <MaterialIcons name="edit" size={24} color="black" />
  );
  const handlePress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (profile: Profile) => {
      if (profile?.id) {
        dispatch(setCurrentProfile(profile));
        navigation.navigate('EditProfile', { profile: profile });
      }
    },
    [dispatch, navigation],
  );

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Surface style={styles.surface}>
          <Card style={styles.card}>
            <Card.Title
              title={profile?.name ?? 'No Name'}
              titleStyle={styles.titleStyle}
              left={renderLeftIcon}
              subtitle={profile?.isOwner ? 'Owner' : 'Member'}
              subtitleStyle={styles.subtitle}
            />

            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={() => handlePress(profile)}>
              <Card style={styles.innerCard}>
                <Card.Title
                  title={profile?.name ?? 'Profile Name'}
                  titleStyle={styles.titleStyle}
                  subtitle={profile?.isOwner ? 'Owner' : 'Member'}
                  left={renderLeftIcon}
                  right={renderRightIcon}
                />
              </Card>
            </TouchableOpacity>
          </Card>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    margin: 16,
    elevation: 2,
    borderRadius: 8,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
  },
  innerCard: {
    marginVertical: 8,
  },
  cardTouchable: {
    paddingVertical: 8,
  },
  avatarIcon: {
    fontSize: 30,
  },
  titleStyle: {
    fontWeight: 'bold',
    marginRight: 16,
    alignSelf: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    color: 'gray',
  },
});
