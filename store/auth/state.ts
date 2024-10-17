export type AuthState = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string; // Optional: Add role if needed
  } | null;
  accessToken: string | null; // Store JWT access token
  refreshToken: string | null; // Store refresh token
  expiresAt: number | null; // Token expiration time in ms
  isAuthenticated: boolean; // True if user is authenticated
  isLoading: boolean; // True when async actions (login/logout) are in progress
  errorMessage: string | null; // Error message for UI
};
