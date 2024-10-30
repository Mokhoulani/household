import apiService, {
  deleteAccessToken,
  setAccessToken,
} from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CompleteTask } from '../../types/CompleteTask';
import { createAppAsyncThunk } from '../hook';
import { setCompletedTasks, setCompletedTasksError } from './reducer';

export const getCompletedTasks = createAppAsyncThunk<
  CompleteTask[],
  { householdId: number }
>('completedTasks/getCompletedTasks', async ({ householdId }, thunkAPI) => {
  try {
    await setAccessToken();
    const response = await apiService.get<
      ApiResponse<{ $values: CompleteTask[] }>
    >(`CompleteTasks/by-household/${householdId}`);
    thunkAPI.dispatch(setCompletedTasks(response.data.$values));
    return response.data.$values;
  } catch (error: any) {
    console.log(error);
    if (error.status === 404) {
      console.log('Finns ej');
      thunkAPI.dispatch(
        setCompletedTasksError('Inga tasks för detta hushåll hittas.'),
      );
      return thunkAPI.rejectWithValue('Inga tasks för detta hushåll hittas.');
    }
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to get Completed Tasks',
    );
  } finally {
    await deleteAccessToken();
  }
});
