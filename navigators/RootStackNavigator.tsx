import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogoutScreen from '../screens/logoutSceern';
import { selectIsAuthenticated } from '../store/auth/selectors';
import { useAppSelector } from '../store/hook';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import DrawerAuthNavigator, {
  DrawerAuthParamList,
} from './DrawerNavigatorAuth';

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  AuthNavigator: NavigatorScreenParams<DrawerAuthParamList>;
  logout: undefined;
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
      <RootStack.Screen name="logout" component={LogoutScreen} />
    </RootStack.Navigator>
  );
}
