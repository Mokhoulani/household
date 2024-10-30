import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
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
import { useGlobalStyles } from '../themes/styles';
import { Profile } from '../types/profile';

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'Dashboard'>;

export default function DashboardProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectProfiles) || [];
  console.log('profiles', profiles);
  const isLoading = useAppSelector(selectProfileIsLoading);
  const error = useAppSelector(selectProfileError);
  const [refreshing, setRefreshing] = useState(false);
  const globalStyles = useGlobalStyles();
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
          style={globalStyles.cardTouchable}
          onPress={() => handlePress(profile)}
          testID={`profile-${profile.id}`}
          accessibilityLabel={`View details for ${
            profile.name || 'Unnamed Profile'
          }`}>
          <Card style={globalStyles.card}>
            <Card.Title
              title={profile.name || 'Unnamed Profile'}
              subtitle={subtitle}
              subtitleStyle={
                profile.isOwner
                  ? globalStyles.ownerSubtitle
                  : globalStyles.memberSubtitle
              }
              // eslint-disable-next-line react/no-unstable-nested-components
              right={() =>
                profile.isOwner ? (
                  <>
                    {selectedAvatar && (
                      <Text style={globalStyles.avatarIcon}>
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
        <View style={globalStyles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={globalStyles.messageContainer}>
          <Text style={globalStyles.errorMessage}>
            {typeof error === 'string' ? error : 'Failed to load profiles'}
          </Text>
          <TouchableOpacity
            onPress={fetchProfiles}
            style={globalStyles.retryButton}
            testID="retry-button">
            <Text style={globalStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (profiles.length === 0) {
      return (
        <Text style={globalStyles.emptyMessage}>No profiles available</Text>
      );
    }

    return profiles?.map(renderProfileItem);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            testID="refresh-control"
          />
        }>
        <Surface style={globalStyles.surface}>{renderContent()}</Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
