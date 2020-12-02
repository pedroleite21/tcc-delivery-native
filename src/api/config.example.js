const env = {
  apiURL: __DEV__
    ? 'http://10.0.2.2:3000/api'
    : API_URL,
  socketURL: __DEV__
    ? 'http://10.0.2.2:3000'
    : SOCKET_URL,
};

console.log(__DEV__, env);

export default env;
