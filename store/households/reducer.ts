import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Household } from '../../types/Household';
import {
  addJoinRequest,
  approveJoinRequest,
  createHousehold,
  rejectJoinRequest,
} from './action';
import { HouseholdState } from './state';

const initialState: HouseholdState = {
  households: [],
  currentHousehold: null,
  isLoading: false,
  error: null,
  members: [],
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
      })

      // Handle Join Request
      .addCase(addJoinRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addJoinRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentHousehold = action.payload;
        state.error = null;
      })
      .addCase(addJoinRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle Approve Request
      .addCase(approveJoinRequest.fulfilled, (state, action) => {
        if (!state.currentHousehold) return;

        const memberIndex = state.currentHousehold.members.findIndex(
          (m) => m.id === action.payload.memberId,
        );

        if (memberIndex !== -1) {
          state.currentHousehold.members[memberIndex] = {
            ...state.currentHousehold.members[memberIndex],
            ...action.payload.updatedProfile,
            isRequest: false,
          };
        }
      })
      .addCase(approveJoinRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle Reject Request
      .addCase(rejectJoinRequest.fulfilled, (state, action) => {
        if (!state.currentHousehold) return;

        state.currentHousehold.members = state.currentHousehold.members.filter(
          (member) => member.id !== action.payload,
        );
      })
      .addCase(rejectJoinRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentHousehold, clearHouseholdError } =
  householdSlice.actions;
export default householdSlice.reducer;
