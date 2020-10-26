import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useIsFetching } from 'react-query';
import BottomNavigation from './bottom_navigation';
import Loading from './loading';

const ROUTES = ['Home', 'Orders', 'Profile'];

export default function Container({ children, absoluteChildren }) {
  const { name } = useRoute();
  const isLoading = useIsFetching() > 0;
  const showNavigation = ROUTES.indexOf(name) !== -1;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollView}>{children}</ScrollView>
      {showNavigation && <BottomNavigation />}
      {absoluteChildren}
      <Loading isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  scrollView: {
    flexGrow: 1,
  },
});
