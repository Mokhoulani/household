import apiService, {
  deleteAccessToken,
  setAccessToken,
} from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateProfilePayload, Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';

export const getProfiles = createAppAsyncThunk<Profile[], void>(
  'profiles',
  async (_, thunkAPI) => {
    try {
      await setAccessToken();
      const response = await apiService.get<ApiResponse<Profile[]>>('Profiles');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get profiles',
      );
    } finally {
      await deleteAccessToken();
    }
  },
);

export const createProfile = createAppAsyncThunk<Profile, CreateProfilePayload>(
  'profiles/createProfile',
  async ({ name, avatarId, isOwner, isRequest, householdId }, thunkAPI) => {
    try {
      await setAccessToken();
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
    } finally {
      await deleteAccessToken();
    }
  },
);
