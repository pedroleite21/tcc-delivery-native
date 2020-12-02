const env = {
  apiURL: __DEV__ ? 'http://10.0.2.2:3000/api' : 'api prod url',
  socketURL: __DEV__ ? 'http://10.0.2.2:3000' : 'socket prod url',
};

console.log(__DEV__, env);

export default env;
