import { Avatar } from '../../types/Avatar';

export type AvatarState = {
  availableAvatars: Avatar[];
  selectedAvatar: Avatar | null;
  isLoading: boolean;
  error: string | null;
};
