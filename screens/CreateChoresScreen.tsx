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
import { useAppDispatch, useAppSelector } from '../store/hook';
import { selectCurrentHousehold } from '../store/households/selectors';
import { selectCurrentProfile } from '../store/profiles/selectors';
import { combinedLightTheme } from '../themes/theme';

// Define type for form data
interface TaskFormData {
  title: string;
  description: string;
  difficulty: number;
  interval: number;
}

// Initial form state
const initialFormState: TaskFormData = {
  title: '',
  description: '',
  difficulty: 0,
  interval: 0,
};

export default function CreateTaskView() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = useAppSelector(selectCurrentProfile);
  const household = useAppSelector(selectCurrentHousehold);

  // Early returns for invalid states
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
      setFormData(initialFormState); // Reset form after successful submission
    } catch (err) {
      setError('Failed to create task. Please try again later.');
      console.error('Task creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Task</Text>

        <TextInput
          placeholder="Enter your title"
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          style={styles.input}
          testID="task-title-input"
        />

        <TextInput
          placeholder="Enter your description"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          style={styles.input}
          multiline
          testID="task-description-input"
        />

        <TextInput
          placeholder="Enter difficulty level (0-10)"
          value={String(formData.difficulty)}
          onChangeText={(value) => handleChange('difficulty', value)}
          keyboardType="numeric"
          style={styles.input}
          testID="task-difficulty-input"
        />

        <TextInput
          placeholder="Enter interval (in days)"
          value={String(formData.interval)}
          onChangeText={(value) => handleChange('interval', value)}
          keyboardType="numeric"
          style={styles.input}
          testID="task-interval-input"
        />

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
  input: {
    borderWidth: 1,
    borderColor: combinedLightTheme.colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: combinedLightTheme.colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
});
