import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const CUSTOMER_INFO_KEY = '@Easy_Delivery_App_Customer_Info';

const initialCustomerInfo = {
  accessToken: null,
  id: null,
};

export async function getCustomerInfo() {
  try {
    const value = await AsyncStorage.getItem(CUSTOMER_INFO_KEY);
    return value != null ? JSON.parse(value) : initialCustomerInfo;
  } catch (e) {
    console.error(e);
    return initialCustomerInfo;
  }
}

export async function setCustomerInfo(data = initialCustomerInfo) {
  try {
    const value = JSON.stringify(data);
    await AsyncStorage.setItem(CUSTOMER_INFO_KEY, value);
    return { error: false };
  } catch (e) {
    console.error(e);
    return { error: true };
  }
}

export async function signIn(value) {
  const { data } = await api.post('/customers/signin', value);

  await setCustomerInfo({
    accessToken: data.accessToken,
    id: data.id,
  });

  return data;
}

export async function createAccount(value) {
  const { data } = await api.post('/customers/signup', value);

  await setCustomerInfo({
    accessToken: data.accessToken,
    id: data.id,
  });

  return data;
}

export async function refreshToken(id) {
  const { data } = await api.post('/customers/refreshtoken', { id });

  await setCustomerInfo({
    accessToken: data.accessToken,
    id: data.id,
  });

  return data;
}
