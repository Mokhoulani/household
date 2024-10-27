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
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getProfiles } from '../store/profiles/action';
import { setCurrentProfile } from '../store/profiles/reducer';
import {
  selectProfileError,
  selectProfileIsLoading,
  selectProfiles,
} from '../store/profiles/selectors';
import { Profile } from '../types/profile';

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'Dashboard'>;

export default function DashboardProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectProfiles) || [];
  console.log('profiles', profiles);
  const isLoading = useAppSelector(selectProfileIsLoading);
  const error = useAppSelector(selectProfileError);
  const [refreshing, setRefreshing] = useState(false);

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
        // If you want to navigate to a details screen, uncomment and modify:
        // navigation.navigate('ProfileDetails', { profileId: profile.id });
      }
    },
    [dispatch],
  );

  const renderProfileItem = useCallback(
    (profile: Profile) => {
      if (!profile?.id) return null;

      const subtitle = profile.Household
        ? `${profile.isOwner ? 'Owner' : 'Member'} of ${profile.Household.name}`
        : profile.isRequest
          ? 'Pending Request'
          : 'No Household';

      return (
        <TouchableOpacity
          key={profile.id}
          style={styles.cardTouchable}
          onPress={() => handlePress(profile)}
          testID={`profile-${profile.id}`}
          accessibilityLabel={`View details for ${profile.name || 'Unnamed Profile'}`}>
          <Card style={styles.card}>
            <Card.Title
              title={profile.name || 'Unnamed Profile'}
              subtitle={subtitle}
            />
          </Card>
        </TouchableOpacity>
      );
    },
    [handlePress],
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

    return profiles.map(renderProfileItem);
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  surface: {
    margin: 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
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
    color: 'gray',
  },
  errorMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#dc3545',
  },
  retryButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
