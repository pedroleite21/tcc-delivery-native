import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, TextInput, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { signIn } from '../api/login';
import Loading from '../components/loading';
import { useAuth } from '../contexts/auth_context';

export default function SignIn() {
  const { control, handleSubmit, errors } = useForm();
  const { top } = useSafeAreaInsets();
  const [message, setMessage] = React.useState('');
  const { dispatchSignIn } = useAuth();

  const [login, { isLoading }] = useMutation(signIn, {
    onSuccess: () => {
      console.log('oi');
      dispatchSignIn();
    },
    onError: (res) => {
      setMessage(res?.response?.data?.message || 'Erro');
    },
  });

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <View style={styles.root}>
      <Appbar.Header statusBarHeight={top}>
        <Appbar.Content title="Entrar na sua conta" />
      </Appbar.Header>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              autoCapitalize="none"
              editable={!isLoading}
              error={errors.email !== undefined}
              keyboardType="email-address"
              label="E-mail"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              style={styles.spacing}
              value={value}
            />
          )}
          name="email"
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            },
          }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              editable={!isLoading}
              error={errors.password !== undefined}
              label="Senha"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              secureTextEntry
              style={styles.spacing}
              value={value}
            />
          )}
          name="password"
          rules={{ required: true }}
          defaultValue=""
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          mode="contained"
          disabled={isLoading}>
          Entre
        </Button>
      </View>
      <Loading isLoading={isLoading} />
      <Snackbar visible={message.length > 0} onDismiss={() => setMessage('')}>
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  container: {
    padding: 16,
  },
  spacing: {
    marginBottom: 16,
  },
});
