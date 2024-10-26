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
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getHouseholds } from '../store/households/action';
import { setCurrentHousehold } from '../store/households/reducer';
import {
  selectHouseholdError,
  selectHouseholdLoading,
  selectHouseholds,
} from '../store/households/selectors';
import { Household } from '../types/Household';

type Props = MaterialTopTabScreenProps<TabHouseholdParamsList, 'Dashboard'>;

export default function DashboardHouseholdScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const households = useAppSelector(selectHouseholds) || [];
  const isLoading = useAppSelector(selectHouseholdLoading);
  const error = useAppSelector(selectHouseholdError);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHouseholds = useCallback(() => {
    dispatch(getHouseholds()).catch((error) => {
      console.error('Failed to fetch households:', error);
    });
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getHouseholds());
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handlePress = useCallback(
    (household: Household) => {
      if (household?.id) {
        dispatch(setCurrentHousehold(household));
        navigation.navigate('DetailsHousehold', { household });
      }
    },
    [dispatch, navigation],
  );

  const renderHouseholdItem = useCallback(
    (item: Household) => {
      if (!item?.id) return null;

      return (
        <TouchableOpacity
          key={item.id}
          style={styles.cardTouchable}
          onPress={() => handlePress(item)}
          testID={`household-${item.id}`}
          accessibilityLabel={`View details for ${item.name || 'Unnamed Household'}`}>
          <Card style={styles.card}>
            <Card.Title
              title={item.name || 'Unnamed Household'}
              subtitle={
                item.profiles
                  ? `${item.profiles.$values.length} members`
                  : 'No members'
              }
            />
          </Card>
        </TouchableOpacity>
      );
    },
    [handlePress],
  );

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

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
            {typeof error === 'string' ? error : 'Failed to load households'}
          </Text>
          <TouchableOpacity
            onPress={fetchHouseholds}
            style={styles.retryButton}
            testID="retry-button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (households.length === 0) {
      return <Text style={styles.emptyMessage}>No households available</Text>;
    }

    return households.map(renderHouseholdItem);
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
