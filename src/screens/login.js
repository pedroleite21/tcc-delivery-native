import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
  const { bottom } = useSafeAreaInsets();

  const handleSignInButton = () => navigation.navigate('SignIn');

  const handleCreateAccountButton = () => navigation.navigate('CreateAccount');

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/login_image.jpg')}
        style={styles.image}
      />
      <View
        style={[styles.loginArea, bottom && { paddingBottom: 32 + bottom }]}>
        <Title style={styles.loginTitle}>Entre ou crie sua conta</Title>
        <Button
          mode="contained"
          style={styles.buttonSpacing}
          onPress={handleSignInButton}>
          Entre
        </Button>
        <Button mode="outlined" onPress={handleCreateAccountButton}>
          Crie sua conta
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  image: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  loginArea: {
    backgroundColor: 'white',
    bottom: 0,
    flexDirection: 'column',
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 32,
    position: 'absolute',
    right: 0,
  },
  loginTitle: {
    paddingBottom: 16,
  },
  buttonSpacing: {
    marginBottom: 16,
  },
});
