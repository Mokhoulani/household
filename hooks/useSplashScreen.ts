import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { initializeAuth } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
  const dispatch = useAppDispatch();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize authentication
        await dispatch(initializeAuth());
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [dispatch]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return { appIsReady, onLayoutRootView };
}
