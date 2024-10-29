import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { selectCurrentHousehold } from '../store/households/selectors';
import { selectCompletedTasks } from '../store/completedTasks/selector';
import { getCompletedTasks } from '../store/completedTasks/action';
import { CompleteTask } from '../types/CompleteTask';
import {
  endOfWeek,
  startOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import PieGrid from '../components/PieGrid';
import PieChart from '../components/PieChart';

export default function StatisticsScreen() {
  const dispatch = useAppDispatch();
  const cT = useAppSelector(selectCompletedTasks);
  const currentHousehold = useAppSelector(selectCurrentHousehold);
  const completedTasksArray: CompleteTask[] = cT.completedTasks || [];

  const [value, setValue] = React.useState('thisWeek');
  const [filteredTasks, setFilteredTasks] = useState<CompleteTask[]>([]);

  useEffect(() => {
    if (currentHousehold?.id != null) {
      dispatch(getCompletedTasks({ householdId: currentHousehold.id }));
    }
  }, [dispatch, currentHousehold?.id]);

  useEffect(() => {
    switch (value) {
      case 'thisWeek':
        setFilteredTasks(getCompletedTasksThisWeek());
        break;
      case 'lastWeek':
        setFilteredTasks(getCompletedTasksLastWeek());
        break;
      case 'lastMonth':
        setFilteredTasks(getCompletedTasksLastMonth());
        break;
      default:
        setFilteredTasks(completedTasksArray);
    }
  }, [value, completedTasksArray]);

  return (
    <View style={styles.page}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          { value: 'thisWeek', label: 'Denna vecka' },
          { value: 'lastWeek', label: 'Förra veckan' },
          { value: 'lastMonth', label: 'Förra månaden' },
        ]}
      />

      {filteredTasks.length > 0 ? (
        <>
          <PieChart
            completedTasks={filteredTasks}
            chartTitle="Total"
            useLabel={true}
            width={Dimensions.get('window').width / 2}
          />
          <PieGrid completedTasks={filteredTasks} />
        </>
      ) : (
        <Text>Inga slutförda uppgifter att visa</Text>
      )}
    </View>
  );

  function getCompletedTasksLastWeek() {
    const today = new Date();
    const firstDayOfLastWeek = startOfWeek(subWeeks(today, 1), {
      weekStartsOn: 1,
    });
    const lastDayOfLastWeek = endOfWeek(firstDayOfLastWeek, {
      weekStartsOn: 1,
    });

    return getCompletedTasksBetweenDates(firstDayOfLastWeek, lastDayOfLastWeek);
  }

  function getCompletedTasksLastMonth() {
    const today = new Date();
    const firstDayOfLastMonth = startOfMonth(subMonths(today, 1));
    const lastDayOfLastMonth = endOfMonth(firstDayOfLastMonth);

    return getCompletedTasksBetweenDates(
      firstDayOfLastMonth,
      lastDayOfLastMonth,
    );
  }

  function getCompletedTasksThisWeek() {
    const today = new Date();
    const firstDayOfWeek = startOfWeek(today);
    return getCompletedTasksBetweenDates(firstDayOfWeek, today);
  }

  function getCompletedTasksBetweenDates(start: Date, end: Date) {
    return completedTasksArray.filter((item) => {
      return (
        new Date(item.completedAt) >= start && new Date(item.completedAt) <= end
      );
    });
  }
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
