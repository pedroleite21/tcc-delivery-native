import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Title, Paragraph, Headline, Subheading } from 'react-native-paper';
import { useQuery } from 'react-query';
import { getCategoryItems } from '../api/products';
import Divider from './divider';

function CategoryItem({ id, name, description, basePrice, image, onPress }) {
  const handlePress = () => onPress?.(id);

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{
          uri: image,
        }}
      />
      <View style={styles.grow}>
        <Title>{name}</Title>
        <Paragraph style={styles.grow}>{description}</Paragraph>
        <Subheading>R$ {basePrice}</Subheading>
      </View>
    </TouchableOpacity>
  );
}

export default function Category({ id, name, onPress }) {
  const { data: items } = useQuery(['category_item', id], getCategoryItems, {
    enabled: id,
  });

  if (!items || items.length === 0) {
    return null;
  } else {
    return (
      <>
        <Headline>{name}</Headline>
        {items.map(({ id: itemId, ...rest }) => (
          <CategoryItem key={itemId} id={itemId} onPress={onPress} {...rest} />
        ))}
        <Divider />
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    flexDirection: 'row',
    height: 120,
  },
  image: {
    height: 120,
    width: 120,
    marginRight: 16,
  },
  grow: {
    flexGrow: 1,
  },
});
