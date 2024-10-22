import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { selectIsAuthenticated } from '../store/auth/selectors';
import { useAppSelector } from '../store/hook';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import DrawerAuthNavigator, {
  DrawerAuthParamList,
} from './DrawerNavigatorAuth';
import SettingsScreen from '../screens/SettingScreen';

export type RootStackParamList = {
  MainNavigator: NavigatorScreenParams<DrawerParamList>;
  AuthNavigator: NavigatorScreenParams<DrawerAuthParamList>;
  settings:undefined;
  logout:undefined;
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
      <RootStack.Screen name="settings" component={SettingsScreen} />
    </RootStack.Navigator>
  );
}
