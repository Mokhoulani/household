import { DrawerScreenProps } from '@react-navigation/drawer';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { DrawerParamList } from '../navigators/DrawerNavigator';
import { RootStackParamList } from '../navigators/RootStackNavigator';
import { TabHouseholdParamsList } from '../navigators/TopTabsNavigtorHouseHold';
import { selectErrorMessage } from '../store/auth/selectors';
import { useAppDispatch } from '../store/hook';
import { createHousehold } from '../store/households/action';
import { RootState } from '../store/store';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TabHouseholdParamsList, 'CreateHousehold'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function CreateHouseholdScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = useSelector(
    (state: RootState) => state.households.isLoading,
  );
  const error = useSelector(selectErrorMessage);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setNameError('Household name is required');
      return false;
    }
    if (name.length < 3) {
      setNameError('Household name must be at least 3 characters');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await dispatch(createHousehold({ name })).unwrap();

      if (result) {
        const profileData = {
          ...result,
          isOwner: true,
          isRequest: true,
        };
        setName('');
        navigation.navigate('CreateProfile', { createProfile: profileData });
      }
    } catch (err) {
      console.error('Household creation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (): StyleProp<TextStyle> => {
    const baseStyle = styles.input;
    if (nameError) {
      return [baseStyle, styles.inputError];
    }
    return baseStyle;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create Household</Text>

        <TextInput
          placeholder="Enter household name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError(null);
          }}
          style={getInputStyle()}
          editable={!isLoading}
          maxLength={50}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (isLoading || !name.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !name.trim()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Household</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
