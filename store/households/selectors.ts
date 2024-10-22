import { RootState } from '../store';

export const selectHouseholds = (state: RootState) => state.households;
export const selectCurrentHousehold = (state: RootState) =>
  state.households.currentHousehold;
export const selectErrorMessage = (state: RootState) => state.households.error;
