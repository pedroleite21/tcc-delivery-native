import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  IconButton,
  Snackbar,
  Text,
  Title,
} from 'react-native-paper';
import { useQuery, useMutation } from 'react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '../components/container';
import {
  getCustomer,
  getCustomerAddresses,
  deleteUserAddress,
} from '../api/customer';
import Loading from '../components/loading';
import { useAuth } from '../contexts/auth_context';

export default function Profile({ navigation }) {
  const { top } = useSafeAreaInsets();
  const [message, setMessage] = React.useState('');

  const { dispatchSignOut } = useAuth();

  const { data: profile } = useQuery('profile', getCustomer);
  const { data: addresses = [], refetch } = useQuery(
    'costumer_address',
    getCustomerAddresses,
  );

  const [deleteAddress, { isLoading }] = useMutation(deleteUserAddress, {
    onSuccess: () => {
      refetch();
    },
    onError: (res) => {
      setMessage(res?.response?.data?.message || 'Erro');
    },
  });

  const handleAddressDelete = async (id) => {
    await deleteAddress(id);
  };

  const handleSignOut = async () => {
    await dispatchSignOut();
  };

  const AbsoluteChildren = () => (
    <>
      <Snackbar visible={message.length > 0} onDismiss={() => setMessage('')}>
        {message}
      </Snackbar>
      <Loading isLoading={isLoading} />
    </>
  );

  return (
    <Container absoluteChildren={<AbsoluteChildren />}>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Perfil" />
      </Appbar.Header>
      <View style={styles.root}>
        <View style={styles.avatarView}>
          <Avatar.Icon size={48} icon="account" />
          <Title style={styles.avatarTitle}>{profile?.name}</Title>
          <Button
            icon="logout-variant"
            mode="contained"
            style={styles.signOut}
            onPress={handleSignOut}>
            Sair
          </Button>
        </View>
        <View style={styles.addressesView}>
          <Title>Endereços</Title>
          {addresses.length > 0 &&
            addresses.map(({ id, name, address_1, address_2, locality }) => (
              <Card key={id} style={styles.cardSpacing}>
                <Card.Title
                  title={name || 'Endereço'}
                  left={(props) => <Avatar.Icon {...props} icon="map-marker" />}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="delete-forever"
                      color="#d81b60"
                      onPress={() => handleAddressDelete(id)}
                    />
                  )}
                />
                <Card.Content>
                  <Text style={styles.textNormal}>{address_1}</Text>
                  <Text style={styles.textNormal}>{address_2}</Text>
                  <Text style={styles.textNormal}>{locality}</Text>
                </Card.Content>
              </Card>
            ))}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
    flexDirection: 'column',
  },
  avatarView: {
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
  },
  avatarTitle: {
    paddingLeft: 16,
    fontSize: 24,
    flexGrow: 1,
  },
  signOut: {
    backgroundColor: '#d81b60',
  },
  addressesView: {
    flexDirection: 'column',
    paddingBottom: 16,
  },
  cardSpacing: {
    marginVertical: 8,
  },
});
