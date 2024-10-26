import { RootState } from '../store';

export const selectHouseholds = (state: RootState) =>
  state.households.households;
export const selectCurrentHousehold = (state: RootState) =>
  state.households.currentHousehold;
export const selectErrorMessage = (state: RootState) => state.households.error;

export const selectHouseholdLoading = (state: RootState) =>
  state.households.isLoading;
export const selectHouseholdError = (state: RootState) =>
  state.households.error;
