import api from './api';
import { getCustomerInfo } from './login';

export async function getPaymentMethods() {
  const { accessToken } = await getCustomerInfo();

  const { data } = await api.get('/payments', {
    headers: {
      'x-access-token': accessToken,
    },
  });

  return data || [];
}
