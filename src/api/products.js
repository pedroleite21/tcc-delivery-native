import api from './api';
import { getCustomerInfo } from './login';

export async function getCategories() {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get('/categories', {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data || [];
}

export async function getCategoryItems(_, id) {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get(`/categories/${id}/items`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data || [];
}

export async function getFeaturedItems() {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get('/items/featured', {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data || [];
}

export async function getItem(_, id) {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get(`/items/${id}`, {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data || [];
}
