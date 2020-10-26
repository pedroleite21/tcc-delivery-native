import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useQuery } from 'react-query';
import { getItem } from '../api/products';
import Container from '../components/container';
import {
  ItemOptionMultiple,
  ItemOptionSingle,
} from '../components/item_option';
import ProductHeader from '../components/product_header';
import TextArea from '../components/text_area';
import ProductProvider, {
  useProductContext,
} from '../contexts/product_context';

const options = {
  multiple: ItemOptionMultiple,
  range: ItemOptionSingle,
  single: ItemOptionSingle,
};

function BottomBar() {
  const { isItemReady } = useProductContext();

  return (
    <View style={styles.bottomBar}>
      <Button mode="contained" disabled={!isItemReady}>
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

  return (
    <ProductProvider>
      <Container absoluteChildren={<BottomBar />}>
        <ProductHeader
          image={item && item.image}
          name={item && item.name}
          description={item && item.description}
          basePrice={item && item.basePrice}
        />
        {renderOptions()}
        <TextArea />
      </Container>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#ddd',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    right: 0,
  },
});
