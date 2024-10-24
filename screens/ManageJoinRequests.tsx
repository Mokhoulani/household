import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentHousehold } from '../store/households/selectors';

export default function ManageJoinRequests() {
  const dispatch = useDispatch();
  const currentHousehold = useSelector(selectCurrentHousehold);
  const pendingRequests = useSelector(selectPendingJoinRequests);

  // Track the loading state for individual requests
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

  const handleRequest = (request, accept) => {
    if (!currentHousehold) return;

    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${accept ? 'accept' : 'reject'} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoadingRequestId(request.accountId); // Set loading state
            try {
              if (accept) {
                await dispatch(
                  acceptJoinRequest({
                    householdId: request.householdId,
                    accountId: request.accountId,
                  }),
                ).unwrap(); // Wait for the action to complete
              } else {
                await dispatch(
                  rejectJoinRequest({
                    householdId: request.householdId,
                    accountId: request.accountId,
                  }),
                ).unwrap();
              }
              Alert.alert(
                'Success',
                `Request has been ${accept ? 'accepted' : 'rejected'}.`,
              );
            } catch (error) {
              Alert.alert(
                'Error',
                `Failed to ${accept ? 'accept' : 'reject'} the request.`,
              );
            } finally {
              setLoadingRequestId(null); // Clear loading state
            }
          },
        },
      ],
    );
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{item.name} wants to join</Text>
      {item.message && (
        <Text style={styles.messageText}>Message: {item.message}</Text>
      )}
      <Text style={styles.timestampText}>
        Requested at: {new Date(item.requestedAt).toLocaleString()}
      </Text>
      <View style={styles.actions}>
        {loadingRequestId === item.accountId ? (
          <ActivityIndicator />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleRequest(item, true)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRequest(item, false)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (pendingRequests.length === 0) {
    return <Text style={styles.infoText}>No pending join requests</Text>;
  }

  return (
    <FlatList
      data={pendingRequests}
      renderItem={renderRequest}
      keyExtractor={(item) => item.accountId}
    />
  );
}

const styles = StyleSheet.create({
  requestItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});
