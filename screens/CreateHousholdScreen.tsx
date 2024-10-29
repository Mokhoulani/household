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
import { globalStyles } from '../themes/styles';

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
          isRequest: false,
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
    const baseStyle = globalStyles.input;
    if (nameError) {
      return [baseStyle, globalStyles.inputError];
    }
    return baseStyle;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Create Household</Text>

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

        {nameError && <Text style={globalStyles.errorText}>{nameError}</Text>}

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            globalStyles.submitButton,
            (isLoading || !name.trim()) && globalStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !name.trim()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={globalStyles.submitButtonText}>Create Household</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
