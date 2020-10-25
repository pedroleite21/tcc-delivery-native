import * as React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#ddd',
    height: 2,
    marginVertical: 16,
    width: '100%',
  },
});
