import * as React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Badge, Title, Subheading } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCartContext } from '../contexts/cart_context';

export default function SeeCartButton() {
  const navigation = useNavigation();
  const {
    cart: { value, items },
  } = useCartContext();

  const _goToCart = () => navigation.navigate('Cart');

  const { length } = items;

  if (length === 0) {
    return null;
  } else {
    return (
      <TouchableOpacity style={styles.root} onPress={_goToCart}>
        <View style={styles.cart}>
          <Icon name="shopping-cart" size={28} />
          <Badge style={styles.badge} size={24}>
            {length}
          </Badge>
        </View>
        <Title>Ver carrinho</Title>
        <Subheading>R$ {value.toFixed(2)}</Subheading>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cart: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
});
