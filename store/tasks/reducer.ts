import { createSlice } from '@reduxjs/toolkit';
import { addTask, deleteTask, editTask, getTasks } from './action';
import { TaskState } from './state';

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })

      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.currentTask = action.payload;
        state.isLoading = false;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })

      // Edit Task Cases
      .addCase(editTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );

        if (taskIndex !== -1) {
          // Update the task in the array
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            ...action.payload,
          };

          // Update currentTask if it's the one being edited
          if (state.currentTask?.id === action.payload.id) {
            state.currentTask = {
              ...state.currentTask,
              ...action.payload,
            };
          }
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(editTask.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : 'An unknown error occurred while editing the task';
        state.isLoading = false;
      })

      // Delete Task Cases
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        // Remove task from tasks array
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);

        // Clear currentTask if it was the deleted task
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : 'An unknown error occurred while deleting the task';
        state.isLoading = false;
      });
  },
});

export const {} = tasksSlice.actions;

export const tasksReducer = tasksSlice.reducer;
