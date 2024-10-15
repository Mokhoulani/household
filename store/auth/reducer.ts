import { createSlice } from '@reduxjs/toolkit';
import { loginWithDotNetAPI } from './action';
import { AuthState } from './state';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithDotNetAPI.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(loginWithDotNetAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginWithDotNetAPI.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
