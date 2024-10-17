import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { initializeAuth } from '../store/auth/action';
import { selectIsAuthenticated } from '../store/auth/selectors';
import { useAppDispatch, useAppSelector } from '../store/hook';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import TopTabsNavigatorAuth, {
  TabAuthParamsList,
} from './TopTabsNavigatorAuth';

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  AuthNavigator: NavigatorScreenParams<TabAuthParamsList>;
  SplashScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // const isLoaded = useAppSelector((state) => state.auth.isLoading); // Get the theme from Redux
  const dispatch = useAppDispatch();
  useEffect(() => {
    // check if user is still logged in
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <RootStack.Navigator>
      {isAuthenticated ? (
        <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
      ) : (
        <RootStack.Screen
          name="AuthNavigator"
          component={TopTabsNavigatorAuth}
        />
      )}
    </RootStack.Navigator>
  );
}
