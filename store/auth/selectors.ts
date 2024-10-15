import { RootState } from '../store';

export const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectErrorMessage = (state: RootState) => state.auth.errorMessage;
