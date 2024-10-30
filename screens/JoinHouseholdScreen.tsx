import { DrawerScreenProps } from '@react-navigation/drawer';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { addJoinRequest } from '../store/households/action';
import { RootState } from '../store/store';
import { useGlobalStyles } from '../themes/styles';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TabHouseholdParamsList, 'JoinHousehold'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function JoinHouseholdScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const globalStyles = useGlobalStyles();

  const isLoading = useSelector(
    (state: RootState) => state.households.isLoading,
  );
  const error = useSelector(selectErrorMessage);

  const validateForm = (): boolean => {
    if (!code.trim()) {
      setCodeError('Household code is required');
      return false;
    }
    if (code.length !== 8) {
      setCodeError('Household code must be 8 characters');
      return false;
    }
    setCodeError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await dispatch(addJoinRequest({ code })).unwrap();

      if (result) {
        const profileData = {
          ...result,
          isOwner: false,
          isRequest: true,
        };
        setCode('');
        navigation.navigate('CreateProfile', { createProfile: profileData });
      }
    } catch (err) {
      Alert.alert(
        'Join Request Failed',
        'Unable to join household. Please verify the code and try again.',
        [{ text: 'OK' }],
      );
      console.error('Join household failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (): StyleProp<TextStyle> => {
    const baseStyle = globalStyles.input;
    if (codeError) {
      return [baseStyle, globalStyles.inputError];
    }
    return baseStyle;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Join Household</Text>

        <Text style={globalStyles.description}>
          Enter the household code provided by the household owner to join their
          household.
        </Text>

        <TextInput
          placeholder="Enter 8-digit-characters code"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            if (codeError) setCodeError(null);
          }}
          style={getInputStyle()}
          editable={!isLoading}
          maxLength={8}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {codeError && <Text style={globalStyles.errorText}>{codeError}</Text>}

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            globalStyles.submitButton,
            (isLoading || !code.trim()) && globalStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !code.trim()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={globalStyles.submitButtonText}>Join Household</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
