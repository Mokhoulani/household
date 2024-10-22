import { HouseholdTask } from './HouseholdTask';
import { Profile } from './profile';

export type Household = {
  id: number;
  name: string;
  code: string;
  members: Profile[];
  tasks: HouseholdTask[];
};
