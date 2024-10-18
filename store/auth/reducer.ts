import { createSlice } from '@reduxjs/toolkit';
import {
  initializeAuth,
  logout,
  refreshTokens,
  saveAccountData,
  signinUser,
  signupUser,
} from './action';
import { AuthState } from './state';

const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
export const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle initializeAuth
    builder.addCase(initializeAuth.pending, (state) => {
      state.isLoading = true; // Show a loading state while initializing
    });
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      if (action.payload) {
        // Update the state with the payload (re-hydrated data)
        Object.assign(state, action.payload);
      }
      state.isLoading = false;
    });
    builder.addCase(initializeAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage =
        (action.payload as string) || 'Auth initialization failed';
    });

    // Handle login action
    builder
      .addCase(signinUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.account;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
        state.isAuthenticated = true;
        state.errorMessage = null;

        // Save account data securely after successful login
        saveAccountData(action.payload); // Ensure this saves data to SecureStore
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
      })

      // Handle token refresh
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
        state.errorMessage = null;

        // Save updated tokens in secure storage
        saveAccountData(action.payload);
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.errorMessage =
          (action.payload as string) || 'Token refresh failed';
      })

      // Handle logout
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState); // Reset state to initial values
      })
      .addCase(logout.rejected, (state, action) => {
        state.errorMessage = (action.payload as string) || 'Logout failed';
      })

      // Handle signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.account;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
        state.isAuthenticated = true;
        state.errorMessage = null;

        // Save account data securely after successful signup
        saveAccountData(action.payload);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          (action.payload as string) || 'Registration failed';
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
