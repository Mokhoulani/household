import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompleteTask } from '../../types/CompleteTask';

interface CompletedTaskState {
  completedTasks: CompleteTask[] | null;
  error: string | null;
}

const initialState: CompletedTaskState = {
  completedTasks: [],
  error: null,
};

const completedTasksSlice = createSlice({
  name: 'completedTasks',
  initialState,
  reducers: {
    setCompletedTasks: (
      state,
      action: PayloadAction<CompleteTask[] | null>,
    ) => {
      state.completedTasks = action.payload;
      state.error = null;
    },
    setCompletedTasksError: (state, action: PayloadAction<string | null>) => {
      state.completedTasks = null;
      state.error = action.payload;
    },
  },
});

export const { setCompletedTasks, setCompletedTasksError } =
  completedTasksSlice.actions;
export default completedTasksSlice.reducer;
