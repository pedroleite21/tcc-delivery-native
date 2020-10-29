import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextInputMask from 'react-native-text-input-mask';
import { useQuery } from 'react-query';
import { getCustomerAddresses, postOrder } from '../api/customer';
import { getPaymentMethods } from '../api/payment';
import Container from '../components/container';
import { useCartContext } from '../contexts/cart_context';

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

function AddressSelection({ addresses, value, handleChange }) {
  const { takeout, addressId } = value;

  const address = addresses.find(({ id }) => id === addressId);

  return (
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
        {address && (
          <>
            <Title>{address.name}</Title>
          </>
        )}
      </View>
    </View>
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
});

function RenderItems({ items }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <View style={styles.view}>
        {items.map(({ id, qty, itemPrice, name, options, notes }) => {
          const price = qty * itemPrice;
          return (
            <View key={`item-${id}`} style={styles.item}>
              <Title style={styles.itemQty}>{qty}</Title>
              <View style={styles.itemInfo}>
                <Title>{name}</Title>
                {options.map((op) => (
                  <Text key={op.name}>
                    • {op.qty} {op.name}
                  </Text>
                ))}
                {notes ? <Text style={styles.itemNotes}>{notes}</Text> : null}
              </View>
              <Title>R$ {price.toFixed(2)}</Title>
            </View>
          );
        })}
      </View>
    );
  } else {
    return null;
  }
}

export default function Cart({ navigation }) {
  const { cart, dispatchCart } = useCartContext();
  const { top } = useSafeAreaInsets();
  const [disabled, setDisabled] = React.useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = React.useState(false);
  const { data: payments } = useQuery('payment', getPaymentMethods);
  const { data: addresses } = useQuery(
    'costumer_address',
    getCustomerAddresses,
  );

  React.useEffect(() => {
    if (addresses) {
      const { id } = addresses.find(({ primary }) => primary === true);

      dispatchCart({
        type: 'set_delivery_address',
        payload: { takeout: false, addressId: id },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const _goBack = () => navigation.goBack();

  const _cleanCart = () => {
    dispatchCart({ type: 'clean_cart' });
    navigation.pop();
    navigation.navigate('Home');
  };

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

  const handleDeliveryChange = ({ takeout }) => {
    if (takeout) {
      dispatchCart({
        type: 'set_delivery_address',
        payload: { takeout },
      });
    } else {
      const { id } = addresses.find(({ primary }) => primary === true);

      dispatchCart({
        type: 'set_delivery_address',
        payload: { takeout: false, addressId: id },
      });
    }
  };

  React.useEffect(() => {
    if (cart?.items?.length > 0 && cart?.delivery && cart.payment?.paymentId) {
      setDisabled(false);
    }
  }, [cart]);

  const _postOrder = async () => {
    await postOrder(cart);
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

  return (
    <Container absoluteChildren={<OrderButton />}>
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
