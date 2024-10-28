import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completedTasks } from '../constants/sampledata';
import { CompletedTask } from '../constants/types';
import { formatDistanceToNow, parseISO, isBefore, subDays } from 'date-fns';

const colors = {
  background: '#fff',
  overdue: '#ffcccc',  // Light red for overdue tasks
};

export default function DailyViewScreen() {
  const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);
  const [isDone, setIsDone] = useState(false);

  const renderItem = ({ item }: { item: CompletedTask }) => {
    const lastCompletedDate = parseISO(item.Task.lastCompletedDate);
    const daysAgo = formatDistanceToNow(lastCompletedDate, { addSuffix: true });
    const overdue = isBefore(lastCompletedDate, subDays(new Date(), item.Task.Difficulty));

    return (
      <TouchableOpacity onPress={() => setSelectedTask(item)}>
        <View style={[styles.taskItem, overdue && { backgroundColor: colors.overdue }]}>
          <Text style={[styles.emoji, { color: item.Profile.Avatar.color }]}>
            {item.Profile.Avatar.icon}
          </Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.Task.Title}</Text>
            <Text style={[styles.userName, { color: item.Profile.Avatar.color }]}>
              {item.Profile.Name}
            </Text>
            <Text style={styles.daysAgo}>
              {daysAgo} {overdue && '(Overdue)'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const markTaskAsDone = () => {
    setIsDone(true);
    setSelectedTask(null); // Close the modal after marking as done
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={completedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.Profile.id}-${item.Task.id}`}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for task details */}
      <Modal visible={!!selectedTask} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.Task.Title}</Text>
                <Text style={styles.modalDescription}>
                  Last done by: {selectedTask.Profile.Name}
                </Text>
                <Text style={styles.modalDescription}>
                  Difficulty: {selectedTask.Task.Difficulty}
                </Text>
                <Button title="Mark as Done" onPress={markTaskAsDone} />
                <Button title="Close" onPress={() => setSelectedTask(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  userName: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  daysAgo: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
});