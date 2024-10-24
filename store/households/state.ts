import { Household } from '../../types/Household';
import { Profile } from '../../types/profile';

export type HouseholdState = {
  households: Household[];
  currentHousehold: Household | null;
  isLoading: boolean;
  error: string | null;
  members: Profile[];
};
