import { Household } from '../../types/Household';

export type HouseholdState = {
  households: Household[];
  currentHousehold: Household | null;
  isLoading: boolean;
  error: string | null;
};
