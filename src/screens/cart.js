import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  Appbar,
  Button,
  Modal,
  Portal,
  Text,
  Title,
  TextInput,
  RadioButton,
  Subheading,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextInputMask from 'react-native-text-input-mask';
import { useQuery, useMutation } from 'react-query';
import { getCustomerAddresses, postOrder } from '../api/customer';
import { getPaymentMethods } from '../api/payment';
import Container from '../components/container';
import { useCartContext } from '../contexts/cart_context';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';

function PaymentModal({
  visible,
  hideModal,
  payments,
  value,
  handleValueChange,
}) {
  const [change, setAmountChange] = React.useState();

  const handleChange = (newValue) => {
    const index = payments.findIndex(({ id }) => id === newValue);
    handleValueChange?.(payments[index]);
  };

  const handleAmount = (f) => {
    const amount = parseFloat(f).toFixed(2);
    setAmountChange(amount);
    handleValueChange?.(amount, true);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modal}
        onDismiss={hideModal}>
        <RadioButton.Group onValueChange={handleChange} value={value}>
          {payments?.map(({ id, name }) => (
            <View key={name} style={styles.paymentItem}>
              <RadioButton value={id} />
              <Subheading style={styles.paymentItemTitle}>{name}</Subheading>
            </View>
          ))}
        </RadioButton.Group>
        <TextInput
          label="Troco"
          disabled={value !== 1}
          mode="outlined"
          keyboardType="numeric"
          value={change}
          render={(props) => (
            <TextInputMask
              {...props}
              mask="[99990].[99]"
              onChangeText={handleAmount}
            />
          )}
        />
      </Modal>
    </Portal>
  );
}

function AddressModal({ visible, addresses, hideModal }) {
  const navigation = useNavigation();

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={[styles.modal, addressSelection.addressModal]}
        onDismiss={hideModal}>
        <ScrollView style={addressSelection.scrollViewModal}>
          {addresses.length > 0 &&
            addresses.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={addressSelection.address}
                onPress={() => hideModal(v.id)}>
                <Title>{v.name}</Title>
              </TouchableOpacity>
            ))}
          <Button
            mode="contained"
            onPress={() => {
              hideModal();
              navigation.navigate('CreateAddress', { fromCart: true });
            }}>
            Criar novo
          </Button>
        </ScrollView>
        <TouchableOpacity
          style={addressSelection.closeButton}
          onPress={() => hideModal()}>
          <Icon name="close" size={24} />
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
}

function AddressSelection({ addresses, value, handleChange }) {
  const [addressModalVisible, setAddressModalVisible] = React.useState(false);
  const { takeout, addressId } = value;

  const address = addresses.find(({ id }) => id === addressId);

  const handleHideModal = (id) => {
    id && handleChange({ takeout: false, id });
    setAddressModalVisible(false);
  };

  const ChooseAnotherButton = () => (
    <Button onPress={() => setAddressModalVisible(true)}>Escolher</Button>
  );

  return (
    <>
      <View style={styles.view}>
        <View style={addressSelection.buttons}>
          <TouchableOpacity
            onPress={() => handleChange({ takeout: false })}
            style={[
              addressSelection.button,
              !takeout && addressSelection.buttonSelected,
            ]}>
            <Title>Entrega</Title>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange({ takeout: true })}
            style={[
              addressSelection.button,
              takeout && addressSelection.buttonSelected,
            ]}>
            <Title>Retirada</Title>
          </TouchableOpacity>
        </View>
        <View>
          {takeout ? (
            <Text>Retirada endereço</Text>
          ) : address ? (
            <>
              <Title>{address.name}</Title>
              <ChooseAnotherButton />
            </>
          ) : (
            <ChooseAnotherButton />
          )}
        </View>
      </View>
      <AddressModal
        visible={addressModalVisible}
        addresses={addresses}
        hideModal={handleHideModal}
      />
    </>
  );
}

const addressSelection = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  buttonSelected: {
    borderBottomColor: '#d81b60',
    borderBottomWidth: 2,
  },
  addressModal: {
    flex: 1,
    marginVertical: 100,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  scrollViewModal: {
    paddingTop: 30,
  },
  address: {
    borderColor: '#ddd',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export function RenderItems({ items, fromOrder = false }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <View style={styles.view}>
        {items.map(
          ({ id, qty, itemPrice, name, options, notes, order_item }) => {
            const price = !fromOrder ? qty * itemPrice : undefined;
            return (
              <View key={`item-${id}`} style={styles.item}>
                <Title style={styles.itemQty}>
                  {qty || order_item?.quantity}
                </Title>
                <View style={styles.itemInfo}>
                  <Title>{name}</Title>
                  {options.map((op) => (
                    <Text key={op.name}>
                      • {op.qty || op.quantity} {op.name}
                    </Text>
                  ))}
                  {notes ? <Text style={styles.itemNotes}>{notes}</Text> : null}
                </View>
                {price && <Title>R$ {price.toFixed(2)}</Title>}
              </View>
            );
          },
        )}
      </View>
    );
  } else {
    return null;
  }
}

export default function Cart({ navigation, route }) {
  const { cart, dispatchCart } = useCartContext();
  const { top } = useSafeAreaInsets();
  const [disabled, setDisabled] = React.useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = React.useState(false);
  const { data: payments } = useQuery('payment', getPaymentMethods);
  const { data: addresses = [] } = useQuery(
    'costumer_address',
    getCustomerAddresses,
  );

  const _cleanCart = () => {
    dispatchCart({ type: 'clean_cart' });
    navigation.pop();
    navigation.navigate('Home');
  };

  const [post, { isLoading }] = useMutation(postOrder, {
    onSuccess: () => {
      _cleanCart();
    },
  });

  React.useEffect(() => {
    const routeAddress = route.params?.addressId;
    if (addresses.length > 0) {
      const address = addresses.find(({ primary }) => primary === true);

      const addressId = routeAddress || address.id;

      if (addressId) {
        dispatchCart({
          type: 'set_delivery_address',
          payload: { takeout: false, addressId: address.id },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const _goBack = () => navigation.goBack();

  const _openPaymentModal = () => setPaymentModalVisible(true);

  const handlePaymentChange = (param, change = false) => {
    if (change) {
      console.log('oi');
      dispatchCart({
        type: 'update_change',
        payload: param,
      });
    } else {
      const { id: paymentId, name } = param;
      dispatchCart({
        type: 'update_payment',
        payload: { paymentId, name },
      });
    }
  };

  const handleDeliveryChange = ({ takeout, id }) => {
    if (takeout) {
      dispatchCart({
        type: 'set_delivery_address',
        payload: { takeout },
      });
    } else {
      const payload = {
        takeout: false,
        ...(id && { addressId: id }),
      };

      dispatchCart({
        type: 'set_delivery_address',
        payload,
      });
    }
  };

  React.useEffect(() => {
    const isDeliverySafe = !cart?.delivery?.takeout
      ? cart?.delivery?.addressId
      : cart?.delivery?.takeout !== undefined;

    if (cart?.items?.length > 0 && isDeliverySafe && cart.payment?.paymentId) {
      setDisabled(false);
    }
  }, [cart]);

  const _postOrder = async () => {
    await post(cart);
  };

  const OrderButton = () => (
    <TouchableOpacity
      onPress={_postOrder}
      style={[styles.orderButton, disabled && styles.orderButtonDisabled]}
      disabled={disabled}>
      <Title style={styles.orderButtonText}>Fazer pedido</Title>
      <Title style={styles.orderButtonText}>R$ {cart.value.toFixed(2)}</Title>
    </TouchableOpacity>
  );

  const AbsoluteChildren = () => (
    <>
      <OrderButton />
      <Loading isLoading={isLoading} />
    </>
  );

  return (
    <Container absoluteChildren={<AbsoluteChildren />}>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Carrinho" />
        <Appbar.Action icon="cart-off" onPress={_cleanCart} />
      </Appbar.Header>
      <AddressSelection
        addresses={addresses}
        handleChange={handleDeliveryChange}
        value={cart?.delivery}
      />
      <RenderItems items={cart?.items} />
      <View style={styles.view}>
        <Title>Pagamento</Title>
        <View style={styles.paymentView}>
          <Text style={styles.size16}>
            {cart.payment?.name ? (
              <>
                {cart.payment.name}
                {cart.payment?.change && (
                  <Text>{` • Troco para R$ ${cart.payment.change}`}</Text>
                )}
              </>
            ) : (
              'Defina uma forma de pagamento'
            )}
          </Text>
          <Button mode="outlined" onPress={_openPaymentModal}>
            Escolher
          </Button>
        </View>
      </View>
      <PaymentModal
        visible={paymentModalVisible}
        payments={payments}
        value={cart.payment?.paymentId}
        hideModal={() => setPaymentModalVisible(false)}
        handleValueChange={handlePaymentChange}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  view: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    padding: 16,
    paddingBottom: 8,
  },
  item: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemQty: {
    backgroundColor: '#000',
    borderRadius: 4,
    color: '#fff',
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  itemInfo: {
    flexDirection: 'column',
    flexGrow: 1,
    marginRight: 16,
  },
  itemNotes: {
    fontStyle: 'italic',
  },
  orderButton: {
    alignItems: 'center',
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  orderButtonDisabled: {
    backgroundColor: '#888',
  },
  orderButtonText: {
    color: '#fff',
  },
  paymentView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  size16: {
    fontSize: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
  },
  paymentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentItemTitle: {
    marginLeft: 8,
  },
});
