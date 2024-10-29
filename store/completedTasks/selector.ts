import { RootState } from '../store';

export const selectCompletedTasks = (state: RootState) => state.completedTasks;
