import { configureStore } from '@reduxjs/toolkit';
import themereducer from './theme/reducer';

export const store = configureStore({
  reducer: {
    theme: themereducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
