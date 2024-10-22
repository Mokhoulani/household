import apiService, { initializeApp } from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateProfilePayload, Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';

export const createProfile = createAppAsyncThunk<Profile, CreateProfilePayload>(
  'profiles/createProfile',
  async ({ name, AvatarId, isOwner, isRequest, HouseholdId }, thunkAPI) => {
    try {
      initializeApp();
      const response = await apiService.post<ApiResponse<Profile>>('Profiles', {
        name,
        AvatarId,
        isOwner,
        isRequest,
        HouseholdId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create profile',
      );
    }
  },
);
