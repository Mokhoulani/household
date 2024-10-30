import React from 'react';
import { Alert, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Surface, Text } from 'react-native-paper';
import { initialAvatars } from '../store/avatars/state';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  approveJoinRequest,
  rejectJoinRequest,
} from '../store/households/action';
import { selectCurrentProfileByAccountId } from '../store/households/selectors';
import { useGlobalStyles } from '../themes/styles';
import { Profile } from '../types/profile';
import { selectCurrentHousehold } from '../store/households/selectors';
import SelectHousehold from '../components/SelectHousehold';

export default function HouseholdDetailsScreen() {
  const dispatch = useAppDispatch();
  const currentHousehold = useAppSelector(selectCurrentHousehold);
  const currentProfile = useAppSelector(selectCurrentProfileByAccountId);
  const globalStyles = useGlobalStyles();
  const avatar = initialAvatars;

  // Explicitly separate owner check
  const isHouseholdOwner = currentProfile?.isOwner === true;

  // Get pending requests - only if user is owner
  const pendingRequests = isHouseholdOwner
    ? currentHousehold?.profiles?.$values?.filter(
        (profile) => !profile.isRequest,
      )
    : [];

  const handleApproveRequest = async (profile: Profile) => {
    // Double-check owner status before any action
    if (!isHouseholdOwner) {
      console.warn('Non-owner attempted to approve request');
      return;
    }

    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve ${profile.name}'s join request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              await dispatch(approveJoinRequest(profile));
            } catch (error) {
              console.error('Failed to approve request:', error);
              // Show error alert
              Alert.alert(
                'Error',
                'Failed to approve the request. Please try again.',
                [{ text: 'OK' }],
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleRejectRequest = async (profile: Profile) => {
    // Double-check owner status before any action
    if (!isHouseholdOwner) {
      console.warn('Non-owner attempted to reject request');
      return;
    }

    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject ${profile.name}'s join request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(rejectJoinRequest(profile));
            } catch (error) {
              console.error('Failed to reject request:', error);
              // Show error alert
              Alert.alert(
                'Error',
                'Failed to reject the request. Please try again.',
                [{ text: 'OK' }],
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Regular members section - visible to all
  const regularMembersSection = (
    <Surface style={globalStyles.surface}>
      <Card style={globalStyles.card}>
        <Card.Title
          title={currentHousehold?.name}
          titleStyle={globalStyles.title}
          // eslint-disable-next-line react/no-unstable-nested-components
          left={() => <Text style={globalStyles.avatarIcon}>🏠</Text>}
          subtitle={`Members (${
            currentHousehold?.profiles?.$values?.filter((p) => !p.isRequest)
              .length ?? 0
          })`}
          subtitleStyle={globalStyles.subtitle}
        />
        <Card.Content style={globalStyles.cardContent}>
          <Text style={globalStyles.code}>code :{currentHousehold?.code}</Text>
        </Card.Content>
        {currentHousehold?.profiles?.$values
          ?.filter((profile) => !profile.isRequest)
          .map((profile) => {
            // Find the matching avatar for each profile
            const selectedAvatar = avatar.find(
              (a) => a.id === profile.avatarId,
            );

            return (
              <TouchableOpacity
                key={profile.id}
                style={globalStyles.cardTouchable}
                onPress={() => console.log('Profile clicked:', profile)}>
                <Card style={globalStyles.card}>
                  <Card.Title
                    title={profile.name}
                    titleStyle={globalStyles.nameBadge}
                    subtitle={profile.isOwner ? 'Owner' : 'Member'}
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
          })}
      </Card>
    </Surface>
  );

  // Pending requests section - only rendered for owner
  const pendingRequestsSection =
    isHouseholdOwner && pendingRequests && pendingRequests.length > 0 ? (
      <Surface style={globalStyles.surface}>
        <Card style={globalStyles.card}>
          <Card.Title
            title="Pending Join Requests"
            subtitle={`${pendingRequests.length} pending`}
          />
          {pendingRequests.map((profile) => (
            <Card key={profile.id} style={globalStyles.requestCard}>
              <Card.Title title={profile.name} />
              <Card.Actions style={globalStyles.actions}>
                <Button
                  mode="contained"
                  onPress={() => handleApproveRequest(profile)}
                  style={globalStyles.actionButton}>
                  Approve
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleRejectRequest(profile)}
                  style={globalStyles.actionButton}
                  buttonColor="#fff">
                  Reject
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </Card>
      </Surface>
    ) : null;

  return (
    <View style={globalStyles.container}>
      <SelectHousehold />
      <ScrollView>
        {regularMembersSection}
        {pendingRequestsSection}
      </ScrollView>
    </View>
  );
}
