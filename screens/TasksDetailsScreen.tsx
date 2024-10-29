import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getTasks } from '../store/tasks/action';
import { globalStyles } from '../themes/styles';
import { HouseholdTask } from '../types/HouseholdTask';

export default function TasksDetailsScreen() {
  // const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Add default empty array as fallback
  const tasks = useAppSelector((state) => state.tasks?.tasks ?? []);
  const loading = useAppSelector((state) => state.tasks?.isLoading ?? false);
  const error = useAppSelector((state) => state.tasks?.error ?? null);

  const fetchTasks = useCallback(() => {
    return dispatch(getTasks()).catch(function (error) {
      console.error('Failed to fetch tasks', error);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
    } finally {
      setRefreshing(false);
    }
  }, [fetchTasks]);

  const handlePress = useCallback((task: HouseholdTask) => {
    if (task?.id) {
    }
  }, []);

  const renderTaskItem = useCallback(
    ({ item }: { item: HouseholdTask | null }) => {
      if (!item?.id) return null;

      return (
        <TouchableOpacity
          key={item.id}
          style={globalStyles.taskItem}
          onPress={() => handlePress(item)}
          accessibilityLabel={`View details of task ${item.title || 'Untitled task'}`}>
          <Card style={globalStyles.card}>
            <Card.Title
              title={item.title || 'Untitled'}
              subtitle={item.description || 'No description'}
            />
            <Card.Content>
              <View style={globalStyles.taskInfo}>
                <View style={globalStyles.badge}>
                  <Text style={globalStyles.badgeText}>
                    Difficulty: {item.difficulty || 'N/A'}
                  </Text>
                </View>
                <View style={globalStyles.badge}>
                  <Text style={globalStyles.badgeText}>
                    Interval: {item.interval ? `${item.interval} days` : 'N/A'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    },
    [handlePress],
  );

  const keyExtractor = useCallback((item: HouseholdTask | null) => {
    return item?.id?.toString() || Math.random().toString();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.centerContainer}>
        <Text style={globalStyles.errorText}>
          Error loading tasks. Please try again.
        </Text>
        <TouchableOpacity style={globalStyles.retryButton} onPress={fetchTasks}>
          <Text style={globalStyles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={globalStyles.listContainer}
        ListEmptyComponent={
          <View style={globalStyles.emptyContainer}>
            <Text style={globalStyles.emptyText}>No tasks found</Text>
          </View>
        }
      />
    </View>
  );
}
