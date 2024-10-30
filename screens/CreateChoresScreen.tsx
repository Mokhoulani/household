import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { TabChoreParamsList } from '../navigators/TopTabsNavigatorChore';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { selectCurrentHousehold } from '../store/households/selectors';
import { selectCurrentProfile } from '../store/profiles/selectors';
import { addTask } from '../store/tasks/action';
import { useGlobalStyles } from '../themes/styles';
import { combinedLightTheme } from '../themes/theme';

interface TaskFormData {
  title: string;
  description: string;
  difficulty: number;
  interval: number;
}

const initialFormState: TaskFormData = {
  title: '',
  description: '',
  difficulty: 0,
  interval: 0,
};

type Props = MaterialTopTabScreenProps<TabChoreParamsList, 'CreateChore'>;

export default function CreateTaskView({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const globalStyles = useGlobalStyles();

  const isOwner = useAppSelector(selectCurrentProfile);
  const household = useAppSelector(selectCurrentHousehold);

  if (!isOwner) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>
          You are not the owner of this household
        </Text>
      </View>
    );
  }

  if (!household) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>No household selected</Text>
      </View>
    );
  }

  const isFormValid = Boolean(
    formData.title.trim() && formData.description.trim(),
  );

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'title' || field === 'description' ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please enter a title and description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(
        addTask({
          ...formData,
          householdId: household.id,
          isArchived: false,
        }),
      );
      setFormData(initialFormState);
      navigation.navigate('TasksDetails');
    } catch (err) {
      setError('Failed to create task. Please try again later.');
      console.error('Task creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    label: string,
    field: keyof TaskFormData,
    placeholder: string,
    options?: {
      multiline?: boolean;
      keyboardType?: 'default' | 'numeric';
      hint?: string;
    },
  ) => (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={String(formData[field])}
        onChangeText={(value) => handleChange(field, value)}
        style={[
          globalStyles.input,
          options?.multiline && globalStyles.multilineInput,
        ]}
        multiline={options?.multiline}
        keyboardType={options?.keyboardType || 'default'}
        testID={`task-${field}-input`}
      />
      {options?.hint && (
        <Text style={globalStyles.hintText}>{options.hint}</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent}>
      <View style={globalStyles.containerInput}>
        <Text style={globalStyles.title}>Create Task</Text>

        {renderFormField('Task Title *', 'title', 'Enter your title', {
          hint: 'Give your task a clear and descriptive title',
        })}

        {renderFormField(
          'Description *',
          'description',
          'Enter your description',
          {
            multiline: true,
            hint: 'Provide detailed instructions for the task',
          },
        )}

        {renderFormField(
          'Difficulty Level',
          'difficulty',
          'Enter difficulty level',
          {
            keyboardType: 'numeric',
            hint: 'Rate difficulty from 0 (easiest) to 10 (hardest)',
          },
        )}

        {renderFormField('Interval', 'interval', 'Enter interval', {
          keyboardType: 'numeric',
          hint: 'How often should this task repeat? (in days)',
        })}

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={combinedLightTheme.colors.primary}
            testID="loading-indicator"
          />
        ) : (
          <Button
            title="Create Task"
            onPress={handleSubmit}
            disabled={!isFormValid}
            testID="submit-button"
          />
        )}
      </View>
    </ScrollView>
  );
}
