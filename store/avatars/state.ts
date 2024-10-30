import { Avatar } from '../../types/Avatar';

export type AvatarState = {
  availableAvatars: Avatar[];
  selectedAvatarId: number | null;
  isLoading: boolean;
  error: string | null;
};

export const initialAvatars: Avatar[] = [
  { id: 1, icon: '🐅', color: '#FFA500' },
  { id: 2, icon: '🐇', color: '#D3D3D3' },
  { id: 3, icon: '🐧', color: '#000000' },
  { id: 4, icon: '🐯', color: '#FFA500' },
  { id: 5, icon: '🐲', color: '#008000' },
  { id: 6, icon: '🐳', color: '#0000FF' },
  { id: 7, icon: '🐦', color: '#FF0000' },
  { id: 8, icon: '🐎', color: '#A52A2A' },
];

export const initialState: AvatarState = {
  availableAvatars: initialAvatars,
  selectedAvatarId: null,
  isLoading: false,
  error: null,
};
