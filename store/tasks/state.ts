import { HouseholdTask } from '../../types/HouseholdTask';

export type TaskState = {
  tasks: HouseholdTask[];
  currentTask: HouseholdTask | null;
  isLoading: boolean;
  error: string | null;
};
