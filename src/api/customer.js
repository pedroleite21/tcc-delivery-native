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

export async function postCustomerAddress(address) {
  const { accessToken, id } = await getCustomerInfo();

  const { data } = await api.post(`/customers/${id}/addresses`, address, {
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

export async function getOrder(_, id) {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get(`/orders/${id}`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data;
}

export async function deleteUserAddress(addressId) {
  const { accessToken, id } = await getCustomerInfo();

  const { data } = await api.delete(`/customers/${id}/addresses/${addressId}`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data;
}
