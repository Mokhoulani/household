import apiService, {
  deleteAccessToken,
  setAccessToken,
} from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import {
  HouseholdTask,
  TaskPayload,
  TaskPayloadUpdtae,
} from '../../types/HouseholdTask';
import { createAppAsyncThunk } from '../hook';

export const getTasks = createAppAsyncThunk<HouseholdTask[], void>(
  'tasks/getTasks',
  async (_, thunkAPI) => {
    try {
      await setAccessToken();
      const response =
        await apiService.get<ApiResponse<{ $values: HouseholdTask[] }>>(
          'HouseholdTasks',
        );
      console.log(response.data.$values);
      return response.data.$values;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get Tasks',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const addTask = createAppAsyncThunk<HouseholdTask, TaskPayload>(
  'tasks/createTask',
  async (task, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.post<ApiResponse<HouseholdTask>>(
        'HouseholdTasks',
        {
          ...task,
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create Task',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const editTask = createAppAsyncThunk<HouseholdTask, TaskPayloadUpdtae>(
  'tasks/editTask',
  async (task, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.put<ApiResponse<HouseholdTask>>(
        `HouseholdTasks/${task.id}`,
        {
          ...task,
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to edit Task',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const deleteTask = createAppAsyncThunk<number, HouseholdTask>(
  'tasks/deleteTask',
  async (task, thunkAPI) => {
    try {
      await setAccessToken();
      await apiService.delete<ApiResponse<HouseholdTask>>(
        `HouseholdTasks/${task.id}`,
      );
      return task.id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete Task',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);
