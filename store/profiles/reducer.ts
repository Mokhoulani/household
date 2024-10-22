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
    setCurrentProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
    },
    clearHouseholdError: (state) => {
      state.error = null;
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

export const { setCurrentProfile, clearHouseholdError } = profilesSlice.actions;
export const profilesReducer = profilesSlice.reducer;
