import * as React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Headline, Subheading, Caption } from 'react-native-paper';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { getFeaturedItems } from '../api/products';
import Divider from './divider';

function FeaturedItem({ basePrice, id, name, image, onPress }) {
  return (
    <TouchableOpacity style={styles.featuredItem} onPress={onPress(id)}>
      <Image
        style={styles.image}
        source={{
          uri: image,
        }}
      />
      <View style={styles.info}>
        <Subheading>{name}</Subheading>
        <Caption>R$ {basePrice}</Caption>
      </View>
    </TouchableOpacity>
  );
}

export default function FeaturedItems() {
  const navigation = useNavigation();
  const { data = [] } = useQuery('featured_items', getFeaturedItems);

  const handleOnPress = (id) => () => {
    navigation.navigate('Product', { id });
  };

  if (data.length === 0) {
    return null;
  } else {
    return (
      <>
        <Headline>Destaques</Headline>
        <ScrollView horizontal style={styles.horizontal}>
          {data.map(({ id, ...rest }) => (
            <FeaturedItem key={id} id={id} onPress={handleOnPress} {...rest} />
          ))}
        </ScrollView>
        <Divider />
      </>
    );
  }
}

const styles = StyleSheet.create({
  horizontal: {
    height: 150,
    marginTop: 8,
  },
  featuredItem: {
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'column',
    height: 150,
    marginRight: 16,
    width: 150,
  },
  image: {
    width: 150,
    height: '50%',
  },
  info: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 4,
  },
});
