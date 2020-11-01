/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { getCustomerInfo, setCustomerInfo } from './api/login';
import AuthContext from './contexts/auth_context';
import CartProvider from './contexts/cart_context';

/** Screens  */
import Cart from './screens/cart';
import CreateAccount from './screens/create_account';
import CreateAddress from './screens/create_address';
import Home from './screens/home';
import Login from './screens/login';
import Order from './screens/order';
import Orders from './screens/orders';
import Product from './screens/product';
import Profile from './screens/profile';
import SignIn from './screens/sign_in';

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
      dispatchSignOut: async () => {
        await setCustomerInfo();
        setIsLogged(false);
      },
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
            <CartProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLogged ? (
                  <>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Product" component={Product} />
                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen
                      name="CreateAddress"
                      component={CreateAddress}
                    />
                    <Stack.Screen name="Orders" component={Orders} />
                    <Stack.Screen name="Order" component={Order} />
                    <Stack.Screen name="Profile" component={Profile} />
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
            </CartProvider>
          </AuthContext.Provider>
        )}
      </NavigationContainer>
    </>
  );
}
