import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Card, Surface } from 'react-native-paper';
import { TabProfileParamsList } from '../navigators/TopTabsNavigatorProfile';
import { initialAvatars } from '../store/avatars/state';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getProfiles } from '../store/profiles/action';
import { setCurrentProfile } from '../store/profiles/reducer';
import {
  selectProfileError,
  selectProfileIsLoading,
  selectProfiles,
} from '../store/profiles/selectors';
import { Profile } from '../types/profile';

const colors = {
  white: '#fff',
  background: '#f5f5f5',
  gray: 'gray',
  error: '#dc3545',
  primary: '#007AFF',
  gold: 'gold',
};

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'Dashboard'>;

export default function DashboardProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectProfiles) || [];
  console.log('profiles', profiles);
  const isLoading = useAppSelector(selectProfileIsLoading);
  const error = useAppSelector(selectProfileError);
  const [refreshing, setRefreshing] = useState(false);
  const avatar = initialAvatars;

  const fetchProfiles = useCallback(() => {
    dispatch(getProfiles()).catch((error) => {
      console.error('Failed to fetch profiles:', error);
    });
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getProfiles());
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handlePress = useCallback(
    (profile: Profile) => {
      if (profile?.id) {
        dispatch(setCurrentProfile(profile));
        navigation.navigate('DetailsProfile', { profile: profile });
      }
    },
    [dispatch, navigation],
  );

  const renderProfileItem = useCallback(
    (profile: Profile) => {
      if (!profile?.id) return null;
      const selectedAvatar = avatar.find((a) => a.id === profile.avatarId);
      const subtitle = profile.household
        ? `${profile.isOwner ? 'Owner' : 'Member'} of ${profile.household.name}`
        : profile.isRequest
          ? 'Pending Request'
          : 'No Household';

      return (
        <TouchableOpacity
          key={profile.id}
          style={styles.cardTouchable}
          onPress={() => handlePress(profile)}
          testID={`profile-${profile.id}`}
          accessibilityLabel={`View details for ${
            profile.name || 'Unnamed Profile'
          }`}>
          <Card style={styles.card}>
            <Card.Title
              title={profile.name || 'Unnamed Profile'}
              subtitle={subtitle}
              subtitleStyle={
                profile.isOwner ? styles.ownerSubtitle : styles.memberSubtitle
              }
              // eslint-disable-next-line react/no-unstable-nested-components
              right={() =>
                profile.isOwner ? (
                  <>
                    {selectedAvatar && (
                      <Text style={styles.avatarIcon}>
                        {selectedAvatar.icon}
                      </Text>
                    )}
                  </>
                ) : null
              }
            />
          </Card>
        </TouchableOpacity>
      );
    },
    [handlePress, avatar],
  );

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const renderContent = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorMessage}>
            {typeof error === 'string' ? error : 'Failed to load profiles'}
          </Text>
          <TouchableOpacity
            onPress={fetchProfiles}
            style={styles.retryButton}
            testID="retry-button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (profiles.length === 0) {
      return <Text style={styles.emptyMessage}>No profiles available</Text>;
    }

    return profiles?.map(renderProfileItem);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            testID="refresh-control"
          />
        }>
        <Surface style={styles.surface}>{renderContent()}</Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  surface: {
    margin: 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  cardTouchable: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: colors.gray,
  },
  errorMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: colors.error,
  },
  retryButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ownerSubtitle: {
    color: colors.gold,
    fontWeight: 'bold',
  },
  memberSubtitle: {
    color: colors.gray,
    fontStyle: 'italic',
  },
  avatarIcon: {
    fontSize: 30,
  },
});
