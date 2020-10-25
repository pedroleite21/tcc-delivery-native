import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Subheading } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

  const _goToProfile = () => navigation.navigate('Profile');

  return (
    <>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.Content title="Restaurante" />
        <Appbar.Action icon="account" onPress={_goToProfile} />
      </Appbar.Header>
      <View style={styles.caption}>
        <Icon name="attach-money" size={20} style={styles.moneyIcon} />
        <Subheading>Pedido mínimo: R$ 25,00</Subheading>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  caption: {
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
  },
  moneyIcon: {
    marginRight: 8,
  },
});
