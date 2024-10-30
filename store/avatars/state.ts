import { Avatar } from '../../types/Avatar';

export type AvatarState = {
  availableAvatars: Avatar[];
  selectedAvatarId: number | null;
  isLoading: boolean;
  error: string | null;
};

export const initialAvatars: Avatar[] = [
  { id: 1, icon: '🐅' },
  { id: 2, icon: '🐇' },
  { id: 3, icon: '🐧' },
  { id: 4, icon: '🐯' },
  { id: 5, icon: '🐲' },
  { id: 6, icon: '🐳' },
  { id: 7, icon: '🐦' },
  { id: 8, icon: '🐎' },
];

export const initialState: AvatarState = {
  availableAvatars: initialAvatars,
  selectedAvatarId: null,
  isLoading: false,
  error: null,
};
