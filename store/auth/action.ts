import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { createAppAsyncThunk } from '../hook';
import { AuthState } from './state';

// Move API_URL to an environment variable or configuration file
const API_URL = 'http://10.25.13.193:5147/api/auth';

// Standardize response types with camelCase
type Account = {
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

// Create a separate API service
const apiService = {
  async post<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || response.statusText || 'Unknown error occurred';
      throw new Error(`API error: ${errorMessage}`);
    }

    return response.json();
  },
};

export const signinUser = createAsyncThunk<
  AuthenticationResponse,
  SignInPayload
>('auth/signinUser', async ({ email, password }, thunkAPI) => {
  try {
    const data = await apiService.post<AuthenticationResponse>('/login', {
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
>('user/register', async ({ email, password, fullName }, thunkAPI) => {
  try {
    const data = await apiService.post<AuthenticationResponse>('/register', {
      email,
      password,
      fullName,
    });

    await saveAccountData(data);

    return data;
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Could not register user');
  }
});

export async function saveAccountData(data: AuthenticationResponse) {
  const accountData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    account: data.account,
    expiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
  };

  await SecureStore.setItemAsync('accountData', JSON.stringify(accountData));
}

async function getAccountData() {
  const accountDataString = await SecureStore.getItemAsync('accountData');
  return accountDataString ? JSON.parse(accountDataString) : null;
}

export const initializeAuth = createAsyncThunk<AuthState | void, void>(
  'auth/initializeAuth',
  async (_, thunkAPI) => {
    try {
      const accountData = await getAccountData();
      if (!accountData) {
        return undefined; // No stored data, return initial state (logged out)
      }

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

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await SecureStore.deleteItemAsync('accountData');
    return; // Successful logout
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const refreshTokens = createAppAsyncThunk<AuthenticationResponse, void>(
  'auth/refreshTokens',
  async (_, thunkAPI) => {
    try {
      const accountData = await getAccountData();
      if (!accountData) throw new Error('No account data found');

      const { accountId, refreshToken } = accountData;

      const data = await apiService.post<AuthenticationResponse>(
        '/refresh-token',
        {
          userId: accountId,
          refreshToken,
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

export async function ensureValidToken(dispatch: any) {
  const accountData = await getAccountData();
  if (!accountData) return false;

  if (Date.now() > accountData.expiresAt) {
    await dispatch(refreshTokens());
    return true;
  }

  return true; // Token is still valid
}

export async function isTokenExpired(): Promise<boolean> {
  const accountData = await getAccountData();
  if (!accountData) return true; // No token saved, treat as expired

  return Date.now() > accountData.expiresAt;
}

// interface Profile {
//   id: number;
//   name: string;
//   isOwner: boolean;
//   householdId: number;
//   accountId: string;
// }

// interface ApiResponse<T> {
//   data: T;
//   message: string;
//   errors: string[];
// }

// export const getUserProfiles = createAsyncThunk<
//   Profile[], // Return type: array of profiles
//   void, // Argument type: no payload needed
//   { state: RootState }
// >('user/getUserProfiles', async (_, thunkAPI) => {
//   const state = thunkAPI.getState();
//   const token = state.auth.accessToken; // Retrieve token from Redux state

//   // Step 1: Check if the token is expired
//   const isExpired = await isTokenExpired();

//   if (isExpired) {
//     // Step 2: Refresh the token if expired
//     try {
//       console.log('Token expired, refreshing...');
//       const refreshResponse = await thunkAPI.dispatch(refreshTokens()).unwrap();
//       console.log('Token refreshed successfully:', refreshResponse);
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       return thunkAPI.rejectWithValue('Failed to refresh token');
//     }
//   }

//   // Step 3: Make the API request
//   try {
//     const updatedToken = state.auth.accessToken; // Get the updated token after refreshing
//     const response = await fetch(`${API_URL}/profiles`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${updatedToken}`, // Use the updated token
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(`Failed to fetch profiles: ${error}`);
//     }

//     // Deserialize the API response into ApiResponse<Profile[]>
//     const apiResponse: ApiResponse<Profile[]> = await response.json();

//     if (apiResponse.errors && apiResponse.errors.length > 0) {
//       // Handle API errors
//       console.error('API errors:', apiResponse.errors);
//       return thunkAPI.rejectWithValue(apiResponse.errors.join(', '));
//     }

//     return apiResponse.data; // Return the profiles array
//   } catch (error: any) {
//     console.error('Error fetching profiles:', error);
//     return thunkAPI.rejectWithValue('Failed to fetch profiles');
//   }
// });
// export const getUserProfiles = createAppAsyncThunk<void, void>(
//   'user/register',
//   async (_, thunkAPI) => {
//     const state = thunkAPI.getState();

//     const response = await fetch(`${API_URL}/profiles`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authentication: 'Bearer ' + state.auth.jwt,
//       },
//     });
//   },
// );

// Client login/register request --> Server endpoint
// Client recieves Response <-- Server Sends JSON Web Token
// Client Stores JSON Web Token in store in redux (AsyncStore/SecureStore)

// Client user/auth request (är jag fortfarande inloggad?) --> Server endpoint (ja/nej)
// Client recieves Response <-- Server Sends User object

// Om JA, Client profile/household request --> Server endpoint
// Client recieves Response <-- Server Sends Users profile/household

// Client create Household Request (with JWT) --> Server endpoint
// ------------ Server creates stores household in database connected to the loged in user
