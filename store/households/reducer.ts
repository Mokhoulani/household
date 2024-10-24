import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Household } from '../../types/Household';
import {
  acceptJoinRequestThunk,
  addJoinRequest,
  createHousehold,
  rejectJoinRequestThunk,
} from './action';
import { HouseholdState } from './state';

const initialState: HouseholdState = {
  households: [],
  currentHousehold: null,
  isLoading: false,
  error: null,
  pendingRequests: [],
};

const householdSlice = createSlice({
  name: 'households',
  initialState,
  reducers: {
    setCurrentHousehold: (state, action: PayloadAction<Household>) => {
      state.currentHousehold = action.payload;
    },
    clearHouseholdError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHousehold.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHousehold.fulfilled, (state, action) => {
        state.households.push(action.payload);
        state.currentHousehold = action.payload;
        state.isLoading = false;
      })
      .addCase(createHousehold.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
    // Add Join Request
    builder.addCase(addJoinRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addJoinRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingRequests.push(action.payload);
    });
    builder.addCase(addJoinRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Failed to add join request';
    });

    // Accept Join Request
    builder.addCase(acceptJoinRequestThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(acceptJoinRequestThunk.fulfilled, (state, action) => {
      state.isLoading = false;

      const index = state.pendingRequests.findIndex(
        (req) =>
          req.accountId === action.payload.accountId &&
          req.householdId === action.payload.householdId,
      );

      if (index !== -1) {
        state.pendingRequests[index] = {
          ...state.pendingRequests[index],
          status: 'accepted',
          acceptedAt:
            action.payload.acceptedAt ??
            state.pendingRequests[index].acceptedAt,
        };
      }
    });

    builder.addCase(acceptJoinRequestThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Failed to accept join request';
    });

    // Reject Join Request
    builder.addCase(rejectJoinRequestThunk.fulfilled, (state, action) => {
      state.isLoading = false;

      const index = state.pendingRequests.findIndex(
        (req) =>
          req.accountId === action.payload.accountId &&
          req.householdId === action.payload.householdId,
      );

      if (index !== -1) {
        state.pendingRequests[index] = {
          ...state.pendingRequests[index],
          status: 'rejected',
          rejectedAt:
            action.payload.rejectedAt ??
            state.pendingRequests[index].rejectedAt,
        };
      }
    });
  },
});

export const { setCurrentHousehold, clearHouseholdError } =
  householdSlice.actions;
export default householdSlice.reducer;
