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
import { addJoinRequest } from '../store/households/action';
import { RootState } from '../store/store';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TabHouseholdParamsList, 'JoinHousehold'>,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    border: '#DDDDDD',
    error: '#FF3B30',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF',
    },
    button: {
      disabled: '#CCCCCC',
      loading: '#0000FF',
    },
  },
} as const;

export default function JoinHouseholdScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          isRequest: false,
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
    const baseStyle = styles.input;
    if (codeError) {
      return [baseStyle, styles.inputError];
    }
    return baseStyle;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Join Household</Text>

        <Text style={styles.description}>
          Enter the household code provided by the household owner to join their
          household.
        </Text>

        <TextInput
          placeholder="Enter 8-digit code"
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase());
            if (codeError) setCodeError(null);
          }}
          style={getInputStyle()}
          editable={!isLoading}
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {codeError && <Text style={styles.errorText}>{codeError}</Text>}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (isLoading || !code.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !code.trim()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Join Household</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: theme.colors.background,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.button.disabled,
  },
  submitButtonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});
