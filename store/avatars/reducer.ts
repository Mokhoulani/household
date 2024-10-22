import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Avatar } from '../../types/Avatar';
import { AvatarState } from './state';

interface AvatarSelection {
  profileId: number;
  avatarId: number;
}

interface ExtendedAvatarState extends AvatarState {
  selectedAvatars: AvatarSelection[];
}

const initialAvatars: Avatar[] = [
  { id: 1, icon: '🐅', color: '#FFA500' }, // Orange for Tiger
  { id: 2, icon: '🐇', color: '#D3D3D3' }, // Light Gray for Rabbit
  { id: 3, icon: '🐧', color: '#000000' }, // Black for Penguin
  { id: 4, icon: '🐯', color: '#FFA500' }, // Orange for Tiger Face
  { id: 5, icon: '🐲', color: '#008000' }, // Green for Dragon
  { id: 6, icon: '🐳', color: '#0000FF' }, // Blue for Whale
  { id: 7, icon: '🐦', color: '#FF0000' }, // Red for Bird
  { id: 8, icon: '🐎', color: '#A52A2A' }, // Brown for Horse
];

const initialState: ExtendedAvatarState = {
  availableAvatars: initialAvatars,
  selectedAvatar: null,
  selectedAvatars: [],
  isLoading: false,
  error: null,
};

const avatarSlice = createSlice({
  name: 'avatars',
  initialState,
  reducers: {
    setSelectedAvatar: (
      state,
      action: PayloadAction<{ avatar: Avatar; profileId: number }>,
    ) => {
      const { avatar, profileId } = action.payload;

      // Check if avatar is already selected by another profile
      const isAvatarTaken = state.selectedAvatars.some(
        (selection) =>
          selection.avatarId === avatar.id && selection.profileId !== profileId,
      );

      if (isAvatarTaken) {
        state.error =
          'This avatar is already selected by another household member';
        return;
      }

      // Remove any existing avatar selection for this profile
      state.selectedAvatars = state.selectedAvatars.filter(
        (selection) => selection.profileId !== profileId,
      );

      // Add new selection
      state.selectedAvatars.push({
        profileId,
        avatarId: avatar.id,
      });

      state.selectedAvatar = avatar;
      state.error = null;
    },

    clearSelectedAvatar: (state, action: PayloadAction<number>) => {
      const profileId = action.payload;
      // Remove avatar selection for this profile
      state.selectedAvatars = state.selectedAvatars.filter(
        (selection) => selection.profileId !== profileId,
      );
      state.selectedAvatar = null;
    },

    setAvatarLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setAvatarError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedAvatar,
  clearSelectedAvatar,
  setAvatarLoading,
  setAvatarError,
} = avatarSlice.actions;

// Updated selector that takes the entire state and profileId
export const getAvailableAvatarsForProfile = (state: {
  avatars: ExtendedAvatarState;
}) => {
  return state.avatars.availableAvatars;
};

export default avatarSlice.reducer;
