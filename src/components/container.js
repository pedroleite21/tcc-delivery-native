import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { useIsFetching } from 'react-query';
import io from 'socket.io-client';
import BottomNavigation from './bottom_navigation';
import Loading from './loading';
import SeeCartButton from './see_cart_button';
import { getCustomerInfo } from '../api/login';
import { statusLabel } from '../screens/orders';
import env from '../api/config';

const ROUTES = ['Home', 'Orders', 'Profile', 'Order'];
const MESSAGE_KEY = 'order_status';

export default function Container({ children, absoluteChildren }) {
  const socketRef = React.useRef(null);
  const { name } = useRoute();
  const isLoading = useIsFetching() > 0;
  const showNavigation = ROUTES.indexOf(name) !== -1;

  React.useEffect(() => {
    async function subscribeSocket() {
      const { id } = await getCustomerInfo();
      const socket = io(`${env.socketURL}/user/${id}`);
      socketRef.current = socket;
      socket.connect();

      socket.on(MESSAGE_KEY, (received) => {
        const { id: orderId, status } = JSON.parse(received);
        const message = `Pedido #${orderId} - ${statusLabel[status]}`;
        PushNotification.localNotification({
          channelId: 'channel-default',
          message,
        });
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          return socket.connect();
        }
      });
    }
    subscribeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollView}>{children}</ScrollView>
      {showNavigation && (
        <>
          <SeeCartButton />
          <BottomNavigation />
        </>
      )}
      {absoluteChildren}
      <Loading isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  scrollView: {
    flexGrow: 1,
  },
});
