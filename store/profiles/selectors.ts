import { RootState } from '../store';

export const selectCurrentProfile = (state: RootState) =>
  state.profiles.currentProfile;
