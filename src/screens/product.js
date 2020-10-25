import * as React from 'react';
import { Text } from 'react-native';
import { useQuery } from 'react-query';
import { getItem } from '../api/products';
import Container from '../components/container';
import ProductHeader from '../components/product_header';

export default function Product({ navigation, route }) {
  const {
    params: { id },
  } = route;

  const { data: item } = useQuery(['item', id], getItem, {
    enabled: id,
  });

  return (
    <Container>
      <ProductHeader image={item.image} />
      <Text>Hello</Text>
    </Container>
  );
}
