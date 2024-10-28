import { RootState } from '../store';

export const selectProfiles = (state: RootState) => state.profiles.profiles;
export const selectCurrentProfile = (state: RootState) =>
  state.profiles.currentProfile; // Changed from setCurrentProfile
export const selectProfileIsLoading = (state: RootState) =>
  state.profiles.isLoading;
export const selectProfileError = (state: RootState) => state.profiles.error;
