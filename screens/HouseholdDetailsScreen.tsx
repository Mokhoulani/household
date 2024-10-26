import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Surface } from 'react-native-paper';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { useAppSelector } from '../store/hook';
import { selectCurrentProfile } from '../store/profiles/selectors';

type Props = MaterialTopTabScreenProps<
  TabHouseholdParamsList,
  'DetailsHousehold'
>;

export default function HouseholdDetailsScreen({ route }: Props) {
  const currentProfile = useAppSelector(selectCurrentProfile);
  console.log('Current profile:', currentProfile);
  const household = route.params?.household;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.surface}>
          <Card style={styles.card}>
            <Card.Title title={household?.name} />
            {household?.profiles?.$values?.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.cardTouchable}
                onPress={() => console.log('Profile clicked:', profile)}>
                <Card style={styles.card}>
                  <Card.Title title={profile.name} />
                </Card>
              </TouchableOpacity>
            ))}
          </Card>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    margin: 16,
    elevation: 2,
    borderRadius: 8,
  },
  cardTouchable: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
