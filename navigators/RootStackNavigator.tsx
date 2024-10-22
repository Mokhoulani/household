import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { selectIsAuthenticated } from '../store/auth/selectors';
import { useAppSelector } from '../store/hook';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import DrawerAuthNavigator, {
  DrawerAuthParamList,
} from './DrawerNavigatorAuth';

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  AuthNavigator: NavigatorScreenParams<DrawerAuthParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="MainNavigator" component={DrawerNavigator} />
      ) : (
        <RootStack.Screen
          name="AuthNavigator"
          component={DrawerAuthNavigator}
        />
      )}
    </RootStack.Navigator>
  );
}
