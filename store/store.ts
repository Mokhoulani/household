import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/reducer';
import themereducer from './theme/reducer';
export const store = configureStore({
  reducer: {
    theme: themereducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
