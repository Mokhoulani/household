import * as SecureStore from 'expo-secure-store';
import apiService from '../../api/apiService';
import { SavingData } from '../../types/SavingData';
import { createAppAsyncThunk } from '../hook';

// Standardize response types with camelCase
export type Account = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};

type SignInPayload = {
  email: string;
  password: string;
};

// Define a constant for token expiration time
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const signinUser = createAppAsyncThunk<
  AuthenticationResponse,
  SignInPayload
>('auth/signinUser', async ({ email, password }, thunkAPI) => {
  try {
    const data = await apiService.post<AuthenticationResponse>('auth/login', {
      email,
      password,
    });
    await saveAccountData(data);

    return data;
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Login failed. Please try again.');
  }
});

type SignupPayload = {
  email: string;
  password: string;
  fullName: string;
};

export const signupUser = createAppAsyncThunk<
  AuthenticationResponse,
  SignupPayload
>('auth/signupUser', async ({ email, password, fullName }, thunkAPI) => {
  try {
    const data = await apiService.post<AuthenticationResponse>(
      'auth/register',
      {
        email,
        password,
        fullName,
      },
    );

    await saveAccountData(data);

    return data;
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Could not register user');
  }
});

export async function saveAccountData(data: AuthenticationResponse) {
  const accountData: SavingData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    account: data.account,
    expiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
  };

  await SecureStore.setItemAsync('accountData', JSON.stringify(accountData));
}

export async function getAccountData(): Promise<SavingData | null> {
  const accountDataString = await SecureStore.getItemAsync('accountData');
  return accountDataString ? JSON.parse(accountDataString) : null;
}

export const initializeAuth = createAppAsyncThunk<SavingData | void, void>(
  'auth/initializeAuth',
  async (_, thunkAPI) => {
    try {
      const accountData = await getAccountData();
      if (!accountData) return; // No stored data, return initial state (logged out)

      // Check if the token has expired
      if (Date.now() > accountData.expiresAt) {
        // Token is expired, refresh it
        const refreshedState = await thunkAPI
          .dispatch(refreshTokens())
          .unwrap();
        return {
          ...accountData,
          accessToken: refreshedState.accessToken,
          refreshToken: refreshedState.refreshToken,
          expiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
          isAuthenticated: true,
        };
      } else {
        // Tokens are still valid, rehydrate the state
        return {
          ...accountData,
          isAuthenticated: true,
          isLoading: false,
          errorMessage: null,
        };
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      return thunkAPI.rejectWithValue('Initialization failed');
    }
  },
);

export const logout = createAppAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await SecureStore.deleteItemAsync('accountData');
      return; // Successful logout
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('Logout failed');
    }
  },
);

export const refreshTokens = createAppAsyncThunk<AuthenticationResponse, void>(
  'auth/refreshTokens',
  async (_, thunkAPI) => {
    try {
      const accountData = await getAccountData();
      if (!accountData) throw new Error('No account data found');
      console.log('refreshTokens', accountData.refreshToken);
      const data = await apiService.post<AuthenticationResponse>(
        'auth/refresh-token',
        {
          userId: accountData.account?.id,
          refreshToken: accountData.refreshToken,
        },
      );

      await saveAccountData(data);

      return data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('Could not refresh tokens');
    }
  },
);
