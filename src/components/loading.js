import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Loading({ isLoading = false }) {
  if (!isLoading) {
    return null;
  } else {
    return (
      <View style={styles.root}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: 'rgba(33,33,33,0.3)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    elevation: 4,
  },
});
