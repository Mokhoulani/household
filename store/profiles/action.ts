import apiService, { initializeApp } from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateProfilePayload, Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';

export const getProfiles = createAppAsyncThunk<Profile[], void>(
  'profiles',
  async (_, thunkAPI) => {
    try {
      initializeApp();
      const response =
        await apiService.get<ApiResponse<{ $values: Profile[] }>>('Profiles');
      return response.data.$values;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get profiles',
      );
    }
  },
);

export const createProfile = createAppAsyncThunk<Profile, CreateProfilePayload>(
  'profiles/createProfile',
  async ({ name, avatarId, isOwner, isRequest, householdId }, thunkAPI) => {
    try {
      initializeApp();
      const response = await apiService.post<ApiResponse<Profile>>('Profiles', {
        name,
        avatarId,
        isOwner,
        isRequest,
        householdId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create profile',
      );
    }
  },
);
