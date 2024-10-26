import apiService, { initializeApp } from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateHousehold, Household } from '../../types/Household';
import { Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';

export const createHousehold = createAppAsyncThunk<Household, CreateHousehold>(
  'households/createHousehold',
  async ({ name }, thunkAPI) => {
    try {
      await initializeApp();
      const response = await apiService.post<ApiResponse<Household>>(
        'Households',
        { name },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create household',
      );
    }
  },
);

export const getHouseholds = createAppAsyncThunk<Household[], void>(
  'households/getHouseholds',
  async (_, thunkAPI) => {
    try {
      await initializeApp();
      const response =
        await apiService.get<ApiResponse<{ $values: Household[] }>>(
          'Households',
        );
      return response.data?.$values;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get households',
      );
    }
  },
);

export const addJoinRequest = createAppAsyncThunk<Household, { code: string }>(
  'household/addJoinRequest',
  async ({ code }, thunkAPI) => {
    try {
      await initializeApp();
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
    }
  },
);

export const approveJoinRequest = createAppAsyncThunk<
  { updatedProfile: Profile; memberId: number },
  Profile
>('household/approveJoinRequest', async (profile, thunkAPI) => {
  try {
    await initializeApp();
    const response = await apiService.put<ApiResponse<Profile>>(
      `/profiles/${profile.id}`,
      { profile },
    );
    return {
      updatedProfile: response.data,
      memberId: profile.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(
        error.message || 'Failed to approve join request',
      );
    }
    return thunkAPI.rejectWithValue('Failed to approve join request');
  }
});

export const rejectJoinRequest = createAppAsyncThunk<number, Profile>(
  'household/rejectJoinRequest',
  async (profile, thunkAPI) => {
    try {
      await initializeApp();
      await apiService.delete(`/profiles/${profile.id}`);
      return profile.id;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || 'Failed to reject join request',
        );
      }
      return thunkAPI.rejectWithValue('Failed to reject join request');
    }
  },
);
