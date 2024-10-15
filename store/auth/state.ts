export type AuthState = {
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
};
