import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Subheading, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNavigation() {
  const { bottom } = useSafeAreaInsets();
  const { name } = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleOnPress = (route) => () => {
    if (route === name) {
      return;
    }

    navigation.navigate(route);
  };

  const buttonStyle = React.useCallback(
    (route) => {
      if (route === name) {
        return styles.colorSelected;
      }
      return { color: theme.colors.primary };
    },
    [name, theme],
  );

  return (
    <View style={[styles.root, { paddingBottom: bottom }]}>
      <TouchableOpacity style={styles.button} onPress={handleOnPress('Home')}>
        <Icon name="home" size={28} style={buttonStyle('Home')} />
        <Subheading style={buttonStyle('Home')}>Início</Subheading>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleOnPress('Orders')}>
        <Icon name="receipt-long" size={28} style={buttonStyle('Orders')} />
        <Subheading style={buttonStyle('Orders')}>Pedidos</Subheading>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleOnPress('Profile')}>
        <Icon name="person" size={28} style={buttonStyle('Profile')} />
        <Subheading style={buttonStyle('Profile')}>Perfil</Subheading>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f5f5f5',
    borderTopColor: '#ddd',
    borderTopWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  colorSelected: {
    color: '#d81b60',
  },
});
