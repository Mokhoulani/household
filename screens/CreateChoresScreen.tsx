import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TabChoreParamsList } from '../navigators/TopTabsNavigatorChore';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { selectCurrentHousehold } from '../store/households/selectors';
import { selectCurrentProfile } from '../store/profiles/selectors';
import { addTask } from '../store/tasks/action';
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

  const isOwner = useAppSelector(selectCurrentProfile);
  const household = useAppSelector(selectCurrentHousehold);

  if (!isOwner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          You are not the owner of this household
        </Text>
      </View>
    );
  }

  if (!household) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No household selected</Text>
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
      Alert.alert('Success', 'Task created successfully');
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
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={String(formData[field])}
        onChangeText={(value) => handleChange(field, value)}
        style={[styles.input, options?.multiline && styles.multilineInput]}
        multiline={options?.multiline}
        keyboardType={options?.keyboardType || 'default'}
        testID={`task-${field}-input`}
      />
      {options?.hint && <Text style={styles.hintText}>{options.hint}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Task</Text>

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

        {error && <Text style={styles.errorText}>{error}</Text>}

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

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: combinedLightTheme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: combinedLightTheme.colors.border,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    backgroundColor: combinedLightTheme.colors.background,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: combinedLightTheme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  errorText: {
    color: combinedLightTheme.colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
});
