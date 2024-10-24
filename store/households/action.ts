import apiService, { initializeApp } from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { Household } from '../../types/Household';
import {
  AcceptJoinRequestPayload,
  PendingJoinRequest,
  RejectJoinRequestPayload,
  RejectJoinRequestResponse,
} from '../../types/PendingJoinRequest';
import { createAppAsyncThunk } from '../hook';
import { HouseholdState } from './state';

export type CreateHouseholdDto = {
  name: string;
};

export const createHousehold = createAppAsyncThunk<
  Household,
  CreateHouseholdDto
>('households/createHousehold', async ({ name }, thunkAPI) => {
  try {
    initializeApp();
    const response = await apiService.post<ApiResponse<Household>>(
      'Households',
      { name },
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to create household',
    );
  }
});

const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const acceptJoinRequestThunk = createAppAsyncThunk<
  PendingJoinRequest,
  AcceptJoinRequestPayload,
  {
    state: { household: HouseholdState };
    rejectValue: { message: string };
  }
>(
  'household/acceptJoinRequest',
  async ({ householdId, accountId }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const household = state.household.households.find(
        (h) => h.id === householdId,
      );
      const request = state.household.pendingRequests.find(
        (req) => req.accountId === accountId && req.householdId === householdId,
      );

      if (!household || !request) {
        return thunkAPI.rejectWithValue({
          message: 'Household or request not found',
        });
      }

      if (request.status === 'accepted') {
        return thunkAPI.rejectWithValue({
          message: 'Request is already accepted',
        });
      }

      const acceptedRequest: PendingJoinRequest = {
        ...request,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      };

      // Simulate API call and ensure `id` is preserved in response
      return await simulateApiCall(acceptedRequest);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  },
);

export const addJoinRequest = createAppAsyncThunk<
  PendingJoinRequest,
  Omit<PendingJoinRequest, 'requestedAt' | 'name' | 'accountId'>,
  {
    state: { household: HouseholdState };
    rejectValue: { message: string };
  }
>('household/addJoinRequest', async (payload, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    // Check if request already exists
    const existingRequest = state.household.pendingRequests.find(
      (req) => req.householdId === payload.householdId,
    );

    if (existingRequest) {
      return thunkAPI.rejectWithValue({
        message: 'A request for this household already exists',
      });
    }

    const newRequest: PendingJoinRequest = {
      ...payload,
      accountId: 'generated-id', // In real app, this would come from auth context
      name: 'User Name', // In real app, this would come from user profile
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    return await simulateApiCall(newRequest);
  } catch (error) {
    return thunkAPI.rejectWithValue({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

export const rejectJoinRequestThunk = createAppAsyncThunk<
  RejectJoinRequestResponse,
  RejectJoinRequestPayload,
  {
    state: { household: HouseholdState };
    rejectValue: { message: string; code: string };
  }
>(
  'household/rejectJoinRequest',
  async ({ householdId, accountId }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const request = state.household.pendingRequests.find(
        (req) => req.accountId === accountId && req.householdId === householdId,
      );

      if (!request) {
        return thunkAPI.rejectWithValue({
          message: 'Join request not found',
          code: 'REQUEST_NOT_FOUND',
        });
      }

      if (request.status === 'rejected') {
        return thunkAPI.rejectWithValue({
          message: 'Request is already rejected',
          code: 'ALREADY_REJECTED',
        });
      }

      const rejectedRequest: RejectJoinRequestResponse = {
        id: request.id,
        householdId,
        accountId,
        rejectedAt: new Date().toISOString(),
        status: 'rejected',
      };

      return await simulateApiCall(rejectedRequest);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      });
    }
  },
);
