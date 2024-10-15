import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../hook';

const API_URL = 'http://10.25.13.193:5147/api/auth'; // Replace with your API URL

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
} | null;

type SinginPayload = {
  email: string;
  password: string;
};

export const loginWithDotNetAPI = createAsyncThunk<User, SinginPayload>(
  'auth/loginWithDotNetAPI',
  async ({ email, password }: SinginPayload, thunkAPI) => {
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

      const data = await response.json();
      console.log('User logged in:', data);

      return data; // Adjust based on your response structure (ensure it returns User)
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

export const singupUser = createAppAsyncThunk<User, SingupPayload>(
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
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to register user: ' + errorText);
      }

      const data = await response.json();
      console.log('User registered:', data);

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return thunkAPI.rejectWithValue('Could not register user');
    }
  },
);
