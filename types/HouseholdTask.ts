import { Household } from './Household';

export type HouseholdTask = {
  id: number;
  title: string;
  description: string;
  householdId: number;
  household: Household;
  difficulty: number;
  interval: number;
  isArchived: boolean;
};

export type TaskPayload = Pick<
  HouseholdTask,
  | 'title'
  | 'description'
  | 'difficulty'
  | 'interval'
  | 'isArchived'
  | 'householdId'
>;
