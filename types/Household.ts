import { HouseholdTask } from './HouseholdTask';
import { Profile } from './profile';

export type Household = {
  id: number;
  name: string;
  code: string;
  profiles: { $values: Profile[] };
  tasks: { $values: HouseholdTask[] };
};

export type CreateHousehold = {
  name: string;
};

export type joinHousehold = {
  code: string;
};
