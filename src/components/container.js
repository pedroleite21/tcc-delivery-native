import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useIsFetching } from 'react-query';
import io from 'socket.io-client';
import BottomNavigation from './bottom_navigation';
import Loading from './loading';
import SeeCartButton from './see_cart_button';
import { getCustomerInfo } from '../api/login';
import { Snackbar } from 'react-native-paper';
import { statusLabel } from '../screens/orders';

const ROUTES = ['Home', 'Orders', 'Profile', 'Order'];
const MESSAGE_KEY = 'order_status';

export default function Container({ children, absoluteChildren }) {
  const [message, setMessage] = React.useState('');
  const socketRef = React.useRef(null);
  const { name } = useRoute();
  const isLoading = useIsFetching() > 0;
  const showNavigation = ROUTES.indexOf(name) !== -1;

  React.useEffect(() => {
    async function subscribeSocket() {
      const { id } = await getCustomerInfo();
      const socket = io(`http://10.0.2.2:3000/user/${id}`);
      socketRef.current = socket;
      socket.connect();

      socket.on(MESSAGE_KEY, (received) => {
        const { id, status } = JSON.parse(received);
        setMessage(`Pedido #${id} - ${statusLabel[status]}`);
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
      <Snackbar visible={message.length > 0} onDismiss={() => setMessage('')}>
        {message}
      </Snackbar>
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
