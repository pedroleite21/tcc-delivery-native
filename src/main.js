/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { getCustomerInfo } from './api/login';
import Home from './screens/home';
import Login from './screens/login';
import SignIn from './screens/sign_in';
import CreateAccount from './screens/create_account';
import AuthContext from './contexts/auth_context';

function Loading() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
      }}>
      <ActivityIndicator animating color={theme.colors.surface} size="large" />
    </View>
  );
}

const Stack = createStackNavigator();

export default function Main() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLogged, setIsLogged] = React.useState(false);

  React.useEffect(() => {
    async function fetchToken() {
      const { accessToken } = await getCustomerInfo();
      if (accessToken) {
        setIsLogged(true);
      }
      setIsLoading(false);
    }
    fetchToken();
  }, []);

  const authFunctions = React.useMemo(
    () => ({
      dispatchSignIn: () => setIsLogged(true),
      dispatchSignOut: () => setIsLogged(false),
    }),
    [],
  );

  return (
    <>
      <StatusBar backgroundColor={theme.colors.backdrop} translucent />
      <NavigationContainer>
        {isLoading ? (
          <Loading />
        ) : (
          <AuthContext.Provider value={authFunctions}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isLogged ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignIn" component={SignIn} />
                  <Stack.Screen
                    name="CreateAccount"
                    component={CreateAccount}
                  />
                </>
              )}
            </Stack.Navigator>
          </AuthContext.Provider>
        )}
      </NavigationContainer>
    </>
  );
}
