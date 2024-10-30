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
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getHouseholds } from '../store/households/action';
import { setCurrentHousehold } from '../store/households/reducer';
import {
  selectHouseholdError,
  selectHouseholdLoading,
  selectHouseholds,
} from '../store/households/selectors';
import { useGlobalStyles } from '../themes/styles';
import { Household } from '../types/Household';

export default function DashboardHouseholdScreen() {
  const dispatch = useAppDispatch();
  const households = useAppSelector(selectHouseholds) || [];
  const isLoading = useAppSelector(selectHouseholdLoading);
  const error = useAppSelector(selectHouseholdError);
  const [refreshing, setRefreshing] = useState(false);
  const globalStyles = useGlobalStyles();

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
      }
    },
    [dispatch],
  );

  const renderHouseholdItem = useCallback(
    (item: Household) => {
      if (!item?.id) return null;

      return (
        <TouchableOpacity
          key={item.id}
          style={globalStyles.cardTouchable}
          onPress={() => handlePress(item)}
          testID={`household-${item.id}`}
          accessibilityLabel={`View details for ${
            item.name || 'Unnamed Household'
          }`}>
          <Card style={globalStyles.card}>
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
    [globalStyles.card, globalStyles.cardTouchable, handlePress],
  );

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

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
            {typeof error === 'string' ? error : 'Failed to load households'}
          </Text>
          <TouchableOpacity
            onPress={fetchHouseholds}
            style={globalStyles.retryButton}
            testID="retry-button">
            <Text style={globalStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (households.length === 0) {
      return (
        <Text style={globalStyles.emptyMessage}>No households available</Text>
      );
    }

    return households.map(renderHouseholdItem);
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
