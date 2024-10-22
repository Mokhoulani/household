import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Household } from '../../types/Household';
import { createHousehold } from './action';
import { HouseholdState } from './state';

const initialState: HouseholdState = {
  households: [],
  currentHousehold: null,
  isLoading: false,
  error: null,
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
  },
});

export const { setCurrentHousehold, clearHouseholdError } =
  householdSlice.actions;
export default householdSlice.reducer;
