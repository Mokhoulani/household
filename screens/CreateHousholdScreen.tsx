import { DrawerScreenProps } from '@react-navigation/drawer';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { DrawerParamList } from '../navigators/DrawerNavigator';
import { RootStackParamList } from '../navigators/RootStackNavigator';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { selectErrorMessage } from '../store/auth/selectors';
import { useAppDispatch } from '../store/hook';
import { createHousehold } from '../store/households/action';
import { selectCurrentHousehold } from '../store/households/selectors';
import { RootState } from '../store/store';

const colors = {
  color: 'red',
};

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TabHouseholdParamsList, 'CreateHousehold'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function CreateHouseholdSceen(props: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');

  const isLoading = useSelector(
    (state: RootState) => state.households.isLoading,
  );
  const error = useSelector(selectErrorMessage);
  const household = useSelector(selectCurrentHousehold);

  useEffect(() => {
    if (household) {
      props.navigation.navigate('CreateProfile', { household });
    }
  }, [household, props.navigation]);

  const handleSubmit = async () => {
    await dispatch(createHousehold({ name }));

    if (!household) {
      console.error('Household creation failed or household not available');
    }

    setName('');
  };

  return (
    <View style={styles.container}>
      <Text>Create Household</Text>

      <TextInput
        placeholder="Enter household name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Create" onPress={handleSubmit} />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: '80%',
  },
  errorText: {
    color: colors.color,
    marginTop: 10,
  },
});
