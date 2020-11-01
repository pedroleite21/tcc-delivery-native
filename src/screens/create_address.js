import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import {
  Appbar,
  Button,
  Checkbox,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '../components/container';
import { postCustomerAddress } from '../api/customer';
import Loading from '../components/loading';

export default function CreateAddress({ navigation, route }) {
  const [message, setMessage] = React.useState('');
  const fromCart = route.params?.fromCart || false;

  const { control, handleSubmit, errors } = useForm();
  const { top } = useSafeAreaInsets();

  const canGoBack = navigation.canGoBack();
  const _goBack = () => navigation.goBack();

  const [postAddress, { isLoading }] = useMutation(postCustomerAddress, {
    onSuccess: (data) => {
      navigation.pop();
      if (fromCart) {
        navigation.navigate('Cart', { addressId: data.id });
      } else {
        navigation.goBack();
      }
    },
    onError: (res) => {
      setMessage(res?.response?.data?.message || 'Erro');
    },
  });

  const onSubmit = async (data) => {
    await postAddress(data);
  };

  return (
    <Container absoluteChildren={<Loading isLoading={isLoading} />}>
      <Appbar.Header statusBarHeight={top}>
        {canGoBack && <Appbar.BackAction onPress={_goBack} />}
        <Appbar.Content title="Adicionar endereço novo" />
      </Appbar.Header>
      <View style={styles.root}>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              autoCapitalize="words"
              error={errors.name !== undefined}
              label="Nome"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              style={styles.spacing}
              value={value}
            />
          )}
          name="name"
          rules={{ required: true }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              autoCapitalize="words"
              error={errors.address_1 !== undefined}
              label="Endereço"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              style={styles.spacing}
              value={value}
            />
          )}
          name="address_1"
          rules={{ required: true }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              autoCapitalize="words"
              error={errors.address_2 !== undefined}
              label="Endereço 2"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              style={styles.spacing}
              value={value}
            />
          )}
          name="address_2"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              autoCapitalize="words"
              error={errors.locality !== undefined}
              label="Cidade / Estado"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(v) => onChange(v)}
              style={styles.spacing}
              value={value}
            />
          )}
          name="locality"
          rules={{ required: true }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Checkbox.Item
              label="Endereço Primário"
              onPress={() => onChange(!value)}
              status={value ? 'checked' : 'unchecked'}
              labelStyle={styles.labelStyle}
            />
          )}
          name="primary"
          defaultValue={false}
        />
        <Button
          mode="contained"
          style={styles.buttonSpacing}
          onPress={handleSubmit(onSubmit)}>
          Criar endereço
        </Button>
      </View>
      <Snackbar visible={message.length > 0} onDismiss={() => setMessage('')}>
        {message}
      </Snackbar>
    </Container>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  spacing: {
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 16,
  },
  labelStyle: {
    color: '#000',
  },
});
