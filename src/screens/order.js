import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Subheading, Title, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { getOrder } from '../api/customer';
import Container from '../components/container';
import { RenderItems } from './cart';
import { parseDate, StatusChip } from './orders';

export default function Order({ navigation, route }) {
  const { top } = useSafeAreaInsets();
  const orderId = route.params?.id;

  const { data: order } = useQuery(['order', orderId], getOrder, {
    enabled: orderId,
  });

  const deliveryAddress = order?.addresses[0];
  const takeout = order?.takeout;
  const paymentMethod = order?.payments[0];

  return (
    <Container>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={orderId ? `Pedido #${orderId}` : 'Pedido'} />
      </Appbar.Header>
      <Title style={styles.spacing}>Status do pedido:</Title>
      <View style={styles.border}>
        <StatusChip status={order?.status} />
        <Subheading>Criado: {parseDate(order?.createdAt)}</Subheading>
        <Subheading>
          Última atualização: {parseDate(order?.updatedAt)}
        </Subheading>
      </View>
      <Title style={styles.spacing}>Endereço de entrega:</Title>
      <View style={styles.border}>
        {takeout ? (
          <Text style={styles.textTitle}>Retirada no restaurante</Text>
        ) : (
          <>
            <Text style={styles.textTitle}>{deliveryAddress?.name}</Text>
            <Text style={styles.textNormal}>{deliveryAddress?.address_1}</Text>
            <Text style={styles.textNormal}>{deliveryAddress?.address_2}</Text>
            <Text style={styles.textNormal}>{deliveryAddress?.locality}</Text>
          </>
        )}
      </View>
      <Title style={styles.spacing}>Itens do pedido:</Title>
      <RenderItems items={order?.items || []} fromOrder />
      <Title style={styles.spacing}>Pagamento:</Title>
      <Text style={styles.text}>
        {paymentMethod?.name && (
          <>
            {paymentMethod.name}
            {paymentMethod?.id === 1 && (
              <Text>{` • Troco para R$ ${paymentMethod?.order_payment?.change}`}</Text>
            )}
          </>
        )}
      </Text>
      <Title style={[styles.spacing, { marginBottom: 16 }]}>
        {order?.value && `Total: R$ ${order?.value}`}
      </Title>
    </Container>
  );
}

const styles = StyleSheet.create({
  spacing: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  text: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  border: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    flexDirection: 'column',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textNormal: {
    fontSize: 16,
  },
});
