import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React from 'react';
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
import { selectCurrentProfile } from '../store/profiles/selectors';
import { deleteTask, editTask } from '../store/tasks/action';
import { useGlobalStyles } from '../themes/styles';
import { combinedLightTheme } from '../themes/theme';
import { TaskPayloadUpdtae } from '../types/HouseholdTask';

// More specific types
interface TaskFormData {
  title: string;
  description: string;
  difficulty: number; // 0-10
  interval: number; // days > 0
}

// Custom hook for form management
const useTaskForm = (initialState: TaskFormData) => {
  const [formData, setFormData] = React.useState<TaskFormData>(initialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.title.trim()) {
      return { isValid: false, error: 'Title is required' };
    }
    if (!formData.description.trim()) {
      return { isValid: false, error: 'Description is required' };
    }
    if (formData.difficulty < 0 || formData.difficulty > 10) {
      return { isValid: false, error: 'Difficulty must be between 0 and 10' };
    }
    if (formData.interval < 1) {
      return { isValid: false, error: 'Interval must be at least 1 day' };
    }
    return { isValid: true };
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'title' || field === 'description' ? value : Number(value),
    }));
  };

  return {
    formData,
    isLoading,
    error,
    setIsLoading,
    setError,
    handleChange,
    validateForm,
  };
};

type Props = MaterialTopTabScreenProps<TabChoreParamsList, 'EditTask'>;

export default function EditTaskScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const task = route.params?.task;
  const household = task?.household;
  const globalStyles = useGlobalStyles();
  const isOwner = useAppSelector(selectCurrentProfile);

  const {
    formData,
    isLoading,
    error,
    setIsLoading,
    setError,
    handleChange,
    validateForm,
  } = useTaskForm({
    title: task?.title || '',
    description: task?.description || '',
    difficulty: task?.difficulty || 0,
    interval: task?.interval || 0,
  });

  // Early return for invalid states
  if (!isOwner || !household) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>
          {!isOwner
            ? 'You are not the owner of this household'
            : 'No household selected'}
        </Text>
      </View>
    );
  }

  const handleDelete = async () => {
    if (!task?.id) {
      setError('Cannot delete: Task ID is missing');
      return;
    }

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setError(null);
            try {
              if (!task?.id) return;
              await dispatch(deleteTask(task));
              navigation.navigate('TasksDetails');
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
              setError(`Failed to delete task: ${errorMessage}`);
              console.error('Task deletion error:', err);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!task?.id) throw new Error('Task ID is required for editing');
      const payload: TaskPayloadUpdtae = {
        id: task.id,
        ...formData,
        householdId: task?.householdId,
        isArchived: false,
      };
      await dispatch(editTask(payload));
      navigation.navigate('TasksDetails');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to create task: ${errorMessage}`);
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
        <Text style={globalStyles.title}>
          {task ? 'Edit Task' : 'Create Task'}
        </Text>

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
          'Enter difficulty level (0-10)',
          {
            keyboardType: 'numeric',
            hint: 'Rate difficulty from 0 (easiest) to 10 (hardest)',
          },
        )}

        {renderFormField('Interval', 'interval', 'Enter interval (days)', {
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
          <View style={globalStyles.button}>
            <Button
              title="Update Task"
              onPress={handleSubmit}
              disabled={!validateForm().isValid}
              testID="submit-button"
            />

            {task && (
              <View>
                <Button
                  title="Delete Task"
                  onPress={handleDelete}
                  color="red"
                  testID="delete-button"
                />
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
