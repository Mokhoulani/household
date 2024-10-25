import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PieChart from './PieChart';
import { CompletedTask } from '../constants/types';

interface Props {
  completedTasks: CompletedTask[];
}

export default function PieGrid({ completedTasks }: Props) {
  const groupedTasks = completedTasks.reduce(
    (acc: { [key: string]: CompletedTask[] }, item: CompletedTask) => {
      if (!acc[item.Task.id]) {
        acc[item.Task.id] = [];
      }

      acc[item.Task.id].push(item);

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
        const taskTitle = tasks[0].Task.Title;
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
