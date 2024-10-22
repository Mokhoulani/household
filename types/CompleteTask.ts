import { HouseholdTask } from './HouseholdTask';
import { Profile } from './profile';

export type CompleteTask = {
  id: number;
  CompletedAt: Date;
  ProfileId: number;
  Profile: Profile;
  HouseholdTaskId: number;
  HouseholdTask: HouseholdTask;
};
