import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Home() {
  return (
    <View style={styles.root}>
      <Text>oi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
});
