import { RootState } from '../store';

export const selectAvatars = (state: RootState) => state;
export const selectAvailableAvatars = (state: RootState) =>
  state.avatars.availableAvatars;
export const selectSelectedAvatarId = (state: RootState) =>
  state.avatars.selectedAvatarId;
export const selectAvatarsLoading = (state: RootState) =>
  state.avatars.isLoading;
export const selectAvatarsError = (state: RootState) => state.avatars.error;
