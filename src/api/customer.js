import api from './api';
import { getCustomerInfo } from './login';

export async function getCustomer() {
  const { accessToken, id } = await getCustomerInfo();

  const { data } = await api.get(`/customers/${id}`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data;
}

export async function getCustomerAddresses() {
  const { accessToken, id } = await getCustomerInfo();

  const { data } = await api.get(`/customers/${id}/addresses`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data;
}

export async function getCustomerOrders() {
  const { accessToken, id } = await getCustomerInfo();

  const { data } = await api.get(`/customers/${id}/orders`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data;
}

export async function postOrder(data) {
  const { accessToken } = await getCustomerInfo();

  return await api.post('/orders', data, {
    headers: {
      'x-access-token': accessToken,
    },
  });
}
