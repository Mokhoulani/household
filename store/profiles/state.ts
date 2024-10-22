import { Profile } from '../../types/profile';

export type ProfileState = {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
};
