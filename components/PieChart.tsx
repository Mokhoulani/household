import React from 'react';
import { VictoryPie } from 'victory-native';
import { View, StyleSheet, Text } from 'react-native';
import { CompletedTask } from '../constants/types';

interface Props {
  completedTasks: CompletedTask[];
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
        if (!acc[item.Profile.id]) {
          acc[item.Profile.id] = {
            color: item.Profile.Avatar.color,
            x: item.Profile.Avatar.icon,
            y: item.Task.Difficulty,
          };
        } else {
          acc[item.Profile.id].y += item.Task.Difficulty;
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
