/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import io from 'socket.io-client';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { getCustomerInfo } from './api/login';
import AuthContext from './contexts/auth_context';
import CreateAccount from './screens/create_account';
import Home from './screens/home';
import Login from './screens/login';
import Product from './screens/product';
import SignIn from './screens/sign_in';

const MESSAGE_KEY = 'order_status';

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
  const socketRef = React.useRef(null);

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

  React.useEffect(() => {
    async function subscribeSocket() {
      if (isLogged) {
        const { id } = await getCustomerInfo();
        const socket = io(`http://10.0.2.2:3000/user/${id}`);
        socketRef.current = socket;
        socket.connect();
        socket.on(MESSAGE_KEY, (received) =>
          console.log('Message received: ' + JSON.parse(received)),
        );
      } else if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
    subscribeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isLogged]);

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
                  <Stack.Screen name="Product" component={Product} />
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
