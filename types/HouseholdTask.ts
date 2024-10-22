import { Household } from './Household';

export type HouseholdTask = {
  id: number;
  title: string;
  description: string;
  householdId: number;
  household: Household;
  Difficulty: number;
  Interval: number;
  IsArchived: boolean;
};
