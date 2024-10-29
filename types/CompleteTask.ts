import { HouseholdTask } from './HouseholdTask';
import { Profile } from './profile';

export type CompleteTask = {
  id: number;
  completedAt: Date;
  profileId: number;
  profile: Profile;
  householdTaskId: number;
  householdTask: HouseholdTask;
};
