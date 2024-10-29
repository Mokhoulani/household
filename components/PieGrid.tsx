import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PieChart from './PieChart';
import { CompleteTask } from '../types/CompleteTask';

interface Props {
  completedTasks: CompleteTask[];
}

export default function PieGrid({ completedTasks }: Props) {
  const groupedTasks = completedTasks.reduce(
    (acc: { [key: string]: CompleteTask[] }, item: CompleteTask) => {
      if (!acc[item.householdTask.id]) {
        acc[item.householdTask.id] = [];
      }

      acc[item.householdTask.id].push(item);

      return acc;
    },
    {},
  );

  const nOfColumns = 3;
  const { width } = Dimensions.get('window');
  const itemWidth = width / nOfColumns - 20;

  return (
    <View style={styles.container}>
      {Object.entries(groupedTasks).map(([id, tasks]) => {
        const taskTitle = tasks[0].householdTask.title;
        return (
          <PieChart
            key={id}
            chartTitle={taskTitle}
            completedTasks={tasks}
            width={itemWidth}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
