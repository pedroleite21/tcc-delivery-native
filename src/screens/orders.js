import * as React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Appbar,
  Button,
  Card,
  Chip,
  Paragraph,
  Title,
} from 'react-native-paper';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { getCustomerOrders } from '../api/customer';
import Container from '../components/container';

export function parseDate(date) {
  if (date) {
    const dateObject = parseISO(date);

    return format(
      dateObject,
      "iii. '•' d 'de' MMM 'de' yyyy', às' HH':'mm'.'",
      {
        locale: ptBR,
      },
    );
  }
  return null;
}

export const statusLabel = {
  awaiting_confirmation: 'Aguardando confirmação',
  confirmed: 'Pedido confirmado',
  on_route: 'Em rota de entrega',
  delivered: 'Pedido entregue',
};

const statusStyle = {
  awaiting_confirmation: { backgroundColor: '#ffef62' },
  confirmed: { backgroundColor: '#64b5f6' },
  on_route: { backgroundColor: '#ffa733' },
  delivered: { backgroundColor: '#81c784' },
};

export function StatusChip({ status }) {
  return (
    <Chip style={[statusStyle[status], { marginBottom: 4 }]}>
      {statusLabel[status]}
    </Chip>
  );
}

const containerStyle = {
  padding: 16,
};

const cardSpacing = {
  marginBottom: 16,
};

export default function Orders({ navigation }) {
  const { top } = useSafeAreaInsets();

  const { data: orders = [] } = useQuery('orders', getCustomerOrders);

  return (
    <Container>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pedidos" />
      </Appbar.Header>
      <View style={containerStyle}>
        {orders.length > 0 ? (
          orders.map(({ id, value, status, createdAt }) => (
            <Card style={cardSpacing} key={id}>
              <Card.Title
                title={`Pedido #${id}`}
                subtitle={`R$ ${value}`}
                left={(props) => <Avatar.Icon {...props} icon="receipt" />}
              />
              <Card.Content>
                <StatusChip status={status} />
                <Paragraph>Realizado em: {parseDate(createdAt)}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.navigate('Order', { id })}>
                  Ver mais detalhes
                </Button>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Title>Você não vez nenhum pedido ainda :/</Title>
        )}
      </View>
    </Container>
  );
}
