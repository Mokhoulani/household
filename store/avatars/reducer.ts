import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAvailableAvatarsForProfile } from './action';
import { initialState } from './state';

const avatarSlice = createSlice({
  name: 'avatars',
  initialState,
  reducers: {
    selectAvatarId: (state, action: PayloadAction<number>) => {
      // Add validation
      const avatarExists = state.availableAvatars.some(
        (avatar) => avatar.id === action.payload,
      );
      if (avatarExists) {
        state.selectedAvatarId = action.payload;
      }
    },
    clearSelectedAvatar: (state) => {
      state.selectedAvatarId = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAvatars: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableAvatarsForProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAvailableAvatarsForProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableAvatars = action.payload;
        // Clear selected avatar if it's no longer available
        if (
          state.selectedAvatarId &&
          !action.payload.some((avatar) => avatar.id === state.selectedAvatarId)
        ) {
          state.selectedAvatarId = null;
        }
      })
      .addCase(getAvailableAvatarsForProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch avatars';
      });
  },
});

export const { selectAvatarId, clearSelectedAvatar, clearError, resetAvatars } =
  avatarSlice.actions;

export default avatarSlice.reducer;
