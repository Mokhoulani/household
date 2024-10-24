import { Household } from '../../types/Household';
import { PendingJoinRequest } from '../../types/PendingJoinRequest';

export type HouseholdState = {
  households: Household[];
  currentHousehold: Household | null;
  isLoading: boolean;
  error: string | null;
  pendingRequests: PendingJoinRequest[];
};
