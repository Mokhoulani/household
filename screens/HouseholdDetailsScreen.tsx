import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Surface, Text } from 'react-native-paper';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { initialAvatars } from '../store/avatars/state';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  approveJoinRequest,
  rejectJoinRequest,
} from '../store/households/action';
import { selectCurrentProfileByAccountId } from '../store/households/selectors';
import { Profile } from '../types/profile';

type Props = MaterialTopTabScreenProps<
  TabHouseholdParamsList,
  'DetailsHousehold'
>;

export default function HouseholdDetailsScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector(selectCurrentProfileByAccountId);
  const avatar = initialAvatars;
  const household = route.params?.household;

  // Explicitly separate owner check
  const isHouseholdOwner = currentProfile?.isOwner === true;

  // Get pending requests - only if user is owner
  const pendingRequests = isHouseholdOwner
    ? household?.profiles?.$values?.filter((profile) => !profile.isRequest)
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
    <Surface style={styles.surface}>
      <Card style={styles.card}>
        <Card.Title
          title={household?.name}
          titleStyle={styles.title}
          // eslint-disable-next-line react/no-unstable-nested-components
          left={() => <Text style={styles.avatarIcon}>🏠</Text>}
          subtitle={`Members (${household?.profiles?.$values?.filter((p) => p.isRequest).length ?? 0})`}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.code}>code :{household?.code}</Text>
        </Card.Content>
        {household?.profiles?.$values
          ?.filter((profile) => profile.isRequest)
          .map((profile) => {
            // Find the matching avatar for each profile
            const selectedAvatar = avatar.find(
              (a) => a.id === profile.avatarId,
            );

            return (
              <TouchableOpacity
                key={profile.id}
                style={styles.cardTouchable}
                onPress={() => console.log('Profile clicked:', profile)}>
                <Card style={styles.card}>
                  <Card.Title
                    title={profile.name}
                    titleStyle={styles.nameBadge}
                    subtitle={profile.isOwner ? 'Owner' : 'Member'}
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
          })}
      </Card>
    </Surface>
  );

  // Pending requests section - only rendered for owner
  const pendingRequestsSection =
    isHouseholdOwner && pendingRequests && pendingRequests.length > 0 ? (
      <Surface style={styles.surface}>
        <Card style={styles.card}>
          <Card.Title
            title="Pending Join Requests"
            subtitle={`${pendingRequests.length} pending`}
          />
          {pendingRequests.map((profile) => (
            <Card key={profile.id} style={styles.requestCard}>
              <Card.Title title={profile.name} />
              <Card.Actions style={styles.actions}>
                <Button
                  mode="contained"
                  onPress={() => handleApproveRequest(profile)}
                  style={styles.actionButton}>
                  Approve
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleRejectRequest(profile)}
                  style={styles.actionButton}
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {regularMembersSection}
        {pendingRequestsSection}
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
  cardTouchable: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  requestCard: {
    marginVertical: 8,
    borderRadius: 8,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  avatarIcon: {
    fontSize: 30,
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
  },
  title: {
    fontWeight: 'bold',
    marginRight: 16,
    alignSelf: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    marginRight: 16,
    alignSelf: 'center',
  },
  nameBadge: {
    fontWeight: 'bold',
    marginRight: 16,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
});
