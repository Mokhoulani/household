import apiService, {
  deleteAccessToken,
  setAccessToken,
} from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateHousehold, Household } from '../../types/Household';
import { Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';

export const createHousehold = createAppAsyncThunk<Household, CreateHousehold>(
  'households/createHousehold',
  async ({ name }, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.post<ApiResponse<Household>>(
        'Households',
        { name },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create household',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const getHouseholds = createAppAsyncThunk<Household[], void>(
  'households/getHouseholds',
  async (_, thunkAPI) => {
    try {
      await setAccessToken();
      const response =
        await apiService.get<ApiResponse<Household[]>>('Households');
      console.log('respos', response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get households',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const addJoinRequest = createAppAsyncThunk<Household, { code: string }>(
  'household/addJoinRequest',
  async ({ code }, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.post<ApiResponse<Household>>(
        'Households/by-code',
        { code },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || 'Failed to join household',
        );
      }
      return thunkAPI.rejectWithValue('Failed to join household');
    } finally {
      await deleteAccessToken();
    }
  },
);

export const approveJoinRequest = createAppAsyncThunk<Profile, Profile>(
  'household/approveJoinRequest',
  async (profile, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.put<ApiResponse<Profile>>(
        `profiles/${profile.id}`,
        {
          ...profile,
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || 'Failed to approve join request',
        );
      }
      return thunkAPI.rejectWithValue('Failed to approve join request');
    } finally {
      await deleteAccessToken();
    }
  },
);

export const rejectJoinRequest = createAppAsyncThunk<number, Profile>(
  'household/rejectJoinRequest',
  async (profile, thunkAPI) => {
    try {
      await setAccessToken();
      await apiService.delete(`profiles/${profile.id}`);
      return profile.id;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || 'Failed to reject join request',
        );
      }
      return thunkAPI.rejectWithValue('Failed to reject join request');
    } finally {
      await deleteAccessToken();
    }
  },
);
