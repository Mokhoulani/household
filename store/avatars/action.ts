import apiService, {
  deleteAccessToken,
  setAccessToken,
} from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { Avatar } from '../../types/Avatar';
import { Profile } from '../../types/profile';
import { createAppAsyncThunk } from '../hook';
import { initialAvatars } from './state';

type GetAvailableAvatarsPayload = {
  householdId: number;
};
export const getAvailableAvatarsForProfile = createAppAsyncThunk<
  Avatar[],
  GetAvailableAvatarsPayload
>('avatars/getAvailableAvatars', async ({ householdId }) => {
  try {
    await setAccessToken();

    const response = await apiService.get<ApiResponse<Profile[]>>(
      `profiles/${householdId}`,
    );

    const profiles = response.data;

    const usedAvatarIds = profiles.map((profile) => {
      return profile.avatarId;
    });

    const availableAvatars = initialAvatars.filter((avatar) => {
      const isUsed = usedAvatarIds.includes(avatar.id);
      return !isUsed;
    });

    return availableAvatars;
  } catch (error) {
    console.log(error);
    return initialAvatars;
  } finally {
    await deleteAccessToken();
  }
});
