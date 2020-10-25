import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getCategories } from '../api/products';
import Category from '../components/category';
import Container from '../components/container';
import FeaturedItems from '../components/featured_items';
import HomeHeader from '../components/home_header';

export default function Home({ navigation }) {
  const { data = [] } = useQuery('categories', getCategories);

  const handlePress = (id) => {
    navigation.navigate('Product', { id });
  };

  const renderCategories = () => {
    if (data.length === 0) {
      return null;
    } else {
      return data.map(({ id, name }) => (
        <Category key={id} id={id} name={name} onPress={handlePress} />
      ));
    }
  };

  return (
    <Container>
      <HomeHeader />
      <View style={styles.root}>
        <FeaturedItems />
        {renderCategories()}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
