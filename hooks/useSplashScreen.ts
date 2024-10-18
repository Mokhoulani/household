import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { initializeAuth } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(initializeAuth());
      setIsLoading(false); // Set loading to false once auth is checked
    };

    checkAuth();
  }, [dispatch]);

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      // Hide the splash screen after loading is complete
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return { isLoading, onLayoutRootView };
}
