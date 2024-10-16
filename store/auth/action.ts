import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { createAppAsyncThunk } from '../hook';

const API_URL = 'http://10.25.13.193:5147/api/auth'; // Replace with your API URL

type Account = {
  id: string;
  name: string;
  email: string;
} | null;

type LoginResponse = {
  AccessToken: string;
  RefreshToken: string;
  Account: Account;
};

type SignInPayload = {
  email: string;
  password: string;
};

export const loginWithDotNetAPI = createAsyncThunk<
  LoginResponse,
  SignInPayload
>(
  'auth/loginWithDotNetAPI',
  async ({ email, password }: SignInPayload, thunkAPI) => {
    try {
      console.log('Logging in user');
      console.log('Sending data:', { email, password });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to log in: ' + errorText);
      }

      const data: LoginResponse = await response.json();
      console.log('User logged in:', data);

      // Create account data object
      const accountData = {
        accessToken: data.AccessToken,
        refreshToken: data.RefreshToken,
        accountId: data.Account?.id, // Ensure this is available in your response
      };

      // Store the account data securely
      await SecureStore.setItemAsync(
        'accountData',
        JSON.stringify(accountData),
      );

      return data; // Adjust based on your response structure
    } catch (error) {
      console.error('Login error:', error);
      return thunkAPI.rejectWithValue('Login failed. Please try again.');
    }
  },
);

type SingupPayload = {
  email: string;
  password: string;
  fullName: string;
};

type registerResponse = {
  AccessToken: string;
  RefreshToken: string;
  Account: Account;
};

export const singupUser = createAppAsyncThunk<registerResponse, SingupPayload>(
  'user/register',
  async ({ email, password, fullName }, thunkAPI) => {
    try {
      console.log('Registering user');
      console.log('Sending data:', { email, password, fullName });

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorJson = await response.json();
        console.error('Server error response:', errorJson);
        throw new Error('Failed to register user: ' + errorJson);
      }

      const data: registerResponse = await response.json();
      console.log('User logged in:', data);

      // Create account data object
      const accountData = {
        accessToken: data.AccessToken,
        refreshToken: data.RefreshToken,
        accountId: data.Account?.id, // Ensure this is available in your response
      };

      // Store the account data securely
      await SecureStore.setItemAsync(
        'accountData',
        JSON.stringify(accountData),
      );

      return data; // Adjust based on your response structure
    } catch (error) {
      console.error('Registration error:', error);
      return thunkAPI.rejectWithValue('Could not register user');
    }
  },
);

export const refreshTokens = createAsyncThunk<
  { accessToken: string; refreshToken: string }, // Return type
  void // No payload type needed
>('auth/refreshTokens', async (_, thunkAPI) => {
  try {
    // Retrieve the stored refresh token and userId from SecureStore
    const accountDataString = await SecureStore.getItemAsync('accountData');

    if (!accountDataString) {
      throw new Error('No account data found');
    }

    const accountData = JSON.parse(accountDataString);
    const { accountId, refreshToken } = accountData; // Extracting accountId and refreshToken

    if (!accountId || !refreshToken) {
      throw new Error('Missing accountId or refreshToken');
    }

    console.log('Refreshing tokens for user:', accountId);

    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: accountId, // Send the user ID
        refreshToken, // Send the refresh token
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorJson = await response.json();
      console.error('Server error response:', errorJson);
      throw new Error('Failed to refresh tokens: ' + errorJson);
    }

    const data = await response.json();
    console.log('Tokens refreshed:', data);

    // Store the new access token and refresh token securely
    await SecureStore.setItemAsync(
      'accountData',
      JSON.stringify({
        ...accountData, // Retain the previous account data
        accessToken: data.AccessToken, // Update the accessToken
        refreshToken: data.RefreshToken, // Update the refreshToken
      }),
    );

    return { accessToken: data.AccessToken, refreshToken: data.RefreshToken }; // Return the new tokens
  } catch (error) {
    console.error('Refresh token error:', error);
    return thunkAPI.rejectWithValue('Could not refresh tokens');
  }
});

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
