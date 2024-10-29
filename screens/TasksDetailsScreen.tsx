import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getTasks } from '../store/tasks/action';
import { HouseholdTask } from '../types/HouseholdTask';

export default function TasksDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Add default empty array as fallback
  const tasks = useAppSelector((state) => state.tasks?.tasks ?? []);
  const loading = useAppSelector((state) => state.tasks?.isLoading ?? false);
  const error = useAppSelector((state) => state.tasks?.error ?? null);

  const fetchTasks = useCallback(() => {
    return dispatch(getTasks()).catch((error) => {
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

  const handlePress = useCallback(
    (task: HouseholdTask) => {
      if (task?.id) {
      }
    },
    [navigation],
  );

  const renderTaskItem = useCallback(
    ({ item }: { item: HouseholdTask | null }) => {
      if (!item?.id) return null;

      return (
        <TouchableOpacity
          key={item.id}
          style={styles.taskItem}
          onPress={() => handlePress(item)}
          accessibilityLabel={`View details of task ${item.title || 'Untitled task'}`}>
          <Card style={styles.card}>
            <Card.Title
              title={item.title || 'Untitled'}
              subtitle={item.description || 'No description'}
            />
            <Card.Content>
              <View style={styles.taskInfo}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    Difficulty: {item.difficulty || 'N/A'}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error loading tasks. Please try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTasks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  taskItem: {
    marginBottom: 12,
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  badge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#616161',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
