import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Title, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import { getItem } from '../api/products';
import Container from '../components/container';
import {
  ItemOptionMultiple,
  ItemOptionRange,
  ItemOptionSingle,
} from '../components/item_option';
import ProductHeader from '../components/product_header';
import TextArea from '../components/text_area';
import ProductProvider, {
  useProductContext,
} from '../contexts/product_context';
import { useCartContext } from '../contexts/cart_context';

const options = {
  multiple: ItemOptionMultiple,
  range: ItemOptionRange,
  single: ItemOptionSingle,
};

function BottomBar({ basePrice, onAddPress }) {
  const {
    dispatchPrice,
    isItemReady,
    itemQty,
    prepareItemsForOrder,
    price,
    setItemQty,
  } = useProductContext();

  const _addItem = () => {
    const optionsRendered = prepareItemsForOrder();
    onAddPress?.(optionsRendered);
  };

  React.useEffect(() => {
    if (basePrice) {
      dispatchPrice?.({ type: 'init', payload: basePrice });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePrice]);

  const removeItemQty = () => {
    itemQty > 1 && setItemQty((prevQty) => prevQty - 1);
  };

  const addItemQty = () => setItemQty((prevQty) => prevQty + 1);

  return (
    <View style={styles.bottomBar}>
      <View style={styles.itemAdd}>
        <TouchableOpacity onPress={removeItemQty}>
          <Icon name="remove" size={20} />
        </TouchableOpacity>
        <Text style={styles.itemQty}>{itemQty}</Text>
        <TouchableOpacity onPress={addItemQty}>
          <Icon name="add" size={20} />
        </TouchableOpacity>
      </View>
      <Title>R$ {(itemQty * price).toFixed(2)}</Title>
      <Button mode="contained" disabled={!isItemReady} onPress={_addItem}>
        Adicionar
      </Button>
    </View>
  );
}

export default function Product({ navigation, route }) {
  const {
    params: { id },
  } = route;

  const { data: item } = useQuery(['item', id], getItem, {
    enabled: id,
  });

  const [notes, setNotes] = React.useState('');
  const { dispatchCart } = useCartContext();

  const renderOptions = () => {
    if (item && Array.isArray(item.options) && item.options.length > 0) {
      return item.options.map(({ id: optionId, type, ...rest }) => {
        const ItemOption = options[type];
        return (
          <ItemOption id={optionId} key={optionId} type={type} {...rest} />
        );
      });
    }
    return null;
  };

  const _addToCart = (customizedItem) => {
    customizedItem.name = item.name;
    customizedItem.id = item.id;
    customizedItem.notes = notes.trim();

    dispatchCart({ type: 'add_item', payload: customizedItem });
    navigation.pop();
    navigation.navigate('Cart');
  };

  return (
    <ProductProvider>
      <Container
        absoluteChildren={
          <BottomBar
            basePrice={item && item.basePrice}
            onAddPress={_addToCart}
          />
        }>
        <ProductHeader
          image={item && item.image}
          name={item && item.name}
          description={item && item.description}
          basePrice={item && item.basePrice}
        />
        {renderOptions()}
        <TextArea onChange={setNotes} />
      </Container>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemAdd: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQty: {
    backgroundColor: '#fff',
    borderRadius: 4,
    fontSize: 20,
    marginHorizontal: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
