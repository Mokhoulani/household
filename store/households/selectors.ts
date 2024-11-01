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

export const selectCurrentProfileByAccountId = (state: RootState) => {
  const { households, currentHousehold } = state.households;
  const userId = state.auth.user?.id;

  const currentHouseholdProfiles = households?.find(
    (h) => h.id === currentHousehold?.id,
  )?.profiles;

  return currentHouseholdProfiles?.find((p) => p.accountId === userId) ?? null;
};
