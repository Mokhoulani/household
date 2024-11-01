import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useCallback, useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Surface, Text } from 'react-native-paper';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { AvatarMap, initialAvatars } from '../store/avatars/state';
import { useAppDispatch } from '../store/hook';
import {
  approveJoinRequest,
  rejectJoinRequest,
} from '../store/households/action';
import { useGlobalStyles } from '../themes/styles';
import { Avatar } from '../types/Avatar';
import { Profile } from '../types/profile';

// Custom hook for request management
const useRequestManagement = (isOwner: boolean) => {
  const dispatch = useAppDispatch();

  const handleApproveRequest = useCallback(
    async (profile: Profile) => {
      if (!isOwner) {
        console.warn('Non-owner attempted to approve request');
        return;
      }

      Alert.alert(
        'Approve Request',
        `Are you sure you want to approve ${profile.name}'s join request?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve',
            style: 'default',
            onPress: async () => {
              try {
                const updatedProfile = { ...profile, isRequest: false };
                await dispatch(approveJoinRequest(updatedProfile));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to approve the request. Please try again.',
                );
              }
            },
          },
        ],
      );
    },
    [dispatch, isOwner],
  );

  const handleRejectRequest = useCallback(
    async (profile: Profile) => {
      if (!isOwner) {
        console.warn('Non-owner attempted to reject request');
        return;
      }

      Alert.alert(
        'Reject Request',
        `Are you sure you want to reject ${profile.name}'s join request?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              try {
                await dispatch(rejectJoinRequest(profile));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to reject the request. Please try again.',
                );
              }
            },
          },
        ],
      );
    },
    [dispatch, isOwner],
  );

  return { handleApproveRequest, handleRejectRequest };
};

const MembersList: React.FC<{
  members: Profile[];
  avatars: Avatar[];
  globalStyles: any;
}> = ({ members, avatars, globalStyles }) => {
  // Create properly typed avatar lookup map
  const avatarMap = useMemo<AvatarMap>(
    () =>
      avatars.reduce(
        (acc: AvatarMap, avatar) => ({
          ...acc,
          [avatar.id]: avatar,
        }),
        {},
      ),
    [avatars],
  );

  return (
    <>
      {members.map((profile) => {
        const selectedAvatar = avatarMap[profile.avatarId];
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
                  profile.isOwner && selectedAvatar ? (
                    <Text style={globalStyles.avatarIcon}>
                      {selectedAvatar.icon}
                    </Text>
                  ) : null
                }
              />
            </Card>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

// Pending requests component
const PendingRequests: React.FC<{
  requests: Profile[];
  onApprove: (profile: Profile) => void;
  onReject: (profile: Profile) => void;
  globalStyles: any;
}> = ({ requests, onApprove, onReject, globalStyles }) => {
  if (!requests?.length) return null;

  return (
    <Surface style={globalStyles.surface}>
      <Card style={globalStyles.card}>
        <Card.Title
          title="Pending Join Requests"
          subtitle={`${requests.length} pending`}
        />
        {requests.map((profile) => (
          <Card key={profile.id} style={globalStyles.requestCard}>
            <Card.Title title={profile.name} />
            <Card.Actions style={globalStyles.actions}>
              <Button
                mode="contained"
                onPress={() => onApprove(profile)}
                style={globalStyles.actionButton}>
                Approve
              </Button>
              <Button
                mode="outlined"
                onPress={() => onReject(profile)}
                style={globalStyles.actionButton}
                buttonColor="#fff">
                Reject
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </Card>
    </Surface>
  );
};

type Props = MaterialTopTabScreenProps<
  TabHouseholdParamsList,
  'DetailsHousehold'
>;

export default function HouseholdDetailsScreen({ route }: Props) {
  const globalStyles = useGlobalStyles();
  const currentHousehold = route.params?.household;

  const ownerProfile = currentHousehold?.profiles?.find(
    (profile) => profile.isOwner,
  );
  const isHouseholdOwner = ownerProfile?.isOwner === true;

  const { regularMembers, pendingRequests } = useMemo(
    () => ({
      regularMembers:
        currentHousehold?.profiles?.filter((p) => !p.isRequest) ?? [],
      pendingRequests:
        currentHousehold?.profiles?.filter((p) => p.isRequest) ?? [],
    }),
    [currentHousehold?.profiles],
  );

  const { handleApproveRequest, handleRejectRequest } =
    useRequestManagement(isHouseholdOwner);

  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Surface style={globalStyles.surface}>
          <Card style={globalStyles.card}>
            <Card.Title
              title={currentHousehold?.name}
              titleStyle={globalStyles.title}
              // eslint-disable-next-line react/no-unstable-nested-components
              left={() => <Text style={globalStyles.avatarIcon}>🏠</Text>}
              subtitle={`Members (${regularMembers.length})`}
              subtitleStyle={globalStyles.subtitle}
            />
            <Card.Content style={globalStyles.cardContent}>
              <Text style={globalStyles.code}>
                code: {currentHousehold?.code}
              </Text>
            </Card.Content>
            <MembersList
              members={regularMembers}
              avatars={initialAvatars}
              globalStyles={globalStyles}
            />
          </Card>
        </Surface>

        {isHouseholdOwner && (
          <PendingRequests
            requests={pendingRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            globalStyles={globalStyles}
          />
        )}
      </ScrollView>
    </View>
  );
}
