import React from 'react';
import { VictoryPie } from 'victory-native';
import { View, StyleSheet, Text } from 'react-native';
import { CompleteTask } from '../types/CompleteTask';
import { initialAvatars } from '../store/avatars/state';

interface Props {
  completedTasks: CompleteTask[];
  chartTitle: string;
  useLabel?: boolean;
  width: number;
}

export default function PieChart({
  completedTasks,
  chartTitle,
  width,
  useLabel = false,
}: Props) {
  const data = Object.values(
    completedTasks.reduce(
      (
        acc: { [key: string]: { x: string; y: number; color: string } },
        item,
      ) => {
        if (!acc[item.profileId]) {
          const avatar = initialAvatars.find(
            (a) => a.id === item.profile.avatarId,
          );
          acc[item.profileId] = {
            color: avatar?.color || 'black',
            x: avatar?.icon || '',
            y: item.householdTask.difficulty,
          };
        } else {
          acc[item.profileId].y += item.householdTask.difficulty;
        }

        return acc;
      },
      {},
    ),
  );

  const colors = data.map((item) => item.color);

  return (
    <View style={styles.container}>
      <VictoryPie
        width={width}
        height={width}
        data={data}
        colorScale={colors}
        labels={useLabel ? ({ datum }) => `${datum.x}` : () => null}
        labelPosition={'centroid'}
        labelRadius={width / 3}
        radius={width / 2}
        labelPlacement={'perpendicular'}
        style={{
          labels: { fontSize: width / 10 },
        }}
      />
      <Text style={styles.text}>{chartTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontWeight: 'bold',
  },
});
