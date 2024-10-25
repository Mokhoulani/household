import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types/profile';
import { createProfile } from './action';
import { ProfileState } from './state';

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
    },
    setIsOwner: (state, action: PayloadAction<boolean>) => {
      if (state.currentProfile) {
        state.currentProfile.isOwner = action.payload;
      }
    },
    setIsRequest: (state, action: PayloadAction<boolean>) => {
      if (state.currentProfile) {
        state.currentProfile.isRequest = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
        state.currentProfile = action.payload;
        state.isLoading = false;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const {
  setCurrentProfile,
  setProfileLoading,
  setIsOwner,
  setIsRequest,
  setProfileError,
} = profilesSlice.actions;
export const profilesReducer = profilesSlice.reducer;
