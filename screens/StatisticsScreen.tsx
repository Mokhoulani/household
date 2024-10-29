import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieChart from '../components/PieChart';
import PieGrid from '../components/PieGrid';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { selectCompletedTasks } from '../store/completedTasks/selector';
import { getCompletedTasks } from '../store/completedTasks/action';
import { CompleteTask } from '../types/CompleteTask';
import { TabParamsList } from '../navigators/TopTabsNavigator';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { selectCurrentHousehold } from '../store/households/selectors';

export default function StatisticsScreen() {
  const dispatch = useAppDispatch();
  const cT = useAppSelector(selectCompletedTasks);
  const currentHousehold = useAppSelector(selectCurrentHousehold);

  useEffect(() => {
    if (currentHousehold?.id != null) {
      console.log(currentHousehold.id);
      dispatch(getCompletedTasks({ householdId: currentHousehold.id }));
    }
  }, [dispatch, currentHousehold?.id]);

  const completedTasksArray: CompleteTask[] = cT.completedTasks?.$values || [];

  return (
    <SafeAreaView style={styles.page}>
      {completedTasksArray.length > 0 ? (
        <>
          <PieChart
            completedTasks={completedTasksArray}
            chartTitle="Total"
            useLabel={true}
            width={Dimensions.get('window').width / 2}
          />

          <PieGrid completedTasks={completedTasksArray} />
        </>
      ) : (
        <Text>Inga slutförda uppgifter att visa.</Text>
      )}
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
