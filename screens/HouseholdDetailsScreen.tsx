import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Surface } from 'react-native-paper';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
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

  const household = route.params?.household;

  const pendingRequests = household?.profiles?.$values?.filter(
    (profile) => profile.isRequest === false,
  );

  useEffect(() => {
    console.log('currentProfile', currentProfile);
  }, [currentProfile]);

  const handleApproveRequest = (profile: Profile) => {
    console.log('profile', profile);
    if (currentProfile?.isOwner) {
      dispatch(
        approveJoinRequest({
          id: profile.id,
          name: profile.name,
          isOwner: profile.isOwner,
          isRequest: profile.isRequest,
          householdId: household?.id,
          accountId: profile.accountId,
          avatarId: profile.avatarId,
          Household: null,
          Account: null,
        }),
      );
    }
  };

  const handleRejectRequest = (profile: Profile) => {
    if (currentProfile?.isOwner) {
      dispatch(rejectJoinRequest(profile));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Regular members list */}
        <Surface style={styles.surface}>
          <Card style={styles.card}>
            <Card.Title title={household?.name} subtitle="Members" />
            {household?.profiles?.$values
              ?.filter((profile) => !profile.isRequest)
              .map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.cardTouchable}
                  onPress={() => console.log('Profile clicked:', profile)}>
                  <Card style={styles.card}>
                    <Card.Title title={profile.name} />
                  </Card>
                </TouchableOpacity>
              ))}
          </Card>
        </Surface>

        {/* Pending requests section - only visible to owner */}
        {currentProfile?.isOwner &&
          pendingRequests &&
          pendingRequests.length > 0 && (
            <Surface style={styles.surface}>
              <Card style={styles.card}>
                <Card.Title
                  title="Pending Join Requests"
                  subtitle={`${pendingRequests.length} pending requests`}
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
          )}
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
});
