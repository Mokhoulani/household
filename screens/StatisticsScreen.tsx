import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieChart from '../components/PieChart';
import { completedTasks } from '../constants/sampledata';
import PieGrid from '../components/PieGrid';

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <PieChart
        completedTasks={completedTasks}
        chartTitle="Total"
        useLabel={true}
        width={Dimensions.get('window').width / 2}
      />
      <PieGrid completedTasks={completedTasks} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    gap: 40,
  },
});
