import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/reducer';
import avatarReducer from './avatars/reducer';
import householdReducer from './households/reducer';
import { profilesReducer } from './profiles/reducer';
import themereducer from './theme/reducer';
export const store = configureStore({
  reducer: {
    theme: themereducer,
    auth: authReducer,
    households: householdReducer,
    profiles: profilesReducer,
    avatars: avatarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
