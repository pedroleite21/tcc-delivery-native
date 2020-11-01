import * as React from 'react';
import update from 'immutability-helper';

const CartContext = React.createContext({});

export const useCartContext = () => React.useContext(CartContext);

const initialState = {
  delivery: {
    takeout: false,
  },
  items: [],
  payment: {},
  value: 0,
};

function cartReducer(state, action) {
  const { type, payload } = action;
  let newState;
  switch (type) {
    case 'clean_cart':
      return initialState;
    case 'add_item':
      const newValue = state.value + payload.qty * payload.itemPrice;
      newState = update(state, { items: { $push: [payload] } });
      newState = update(newState, { value: { $set: newValue } });
      return newState;
    case 'update_payment':
      newState = update(state, { payment: { $set: payload } });
      return newState;
    case 'update_change':
      newState = update(state, { payment: { change: { $set: payload } } });
      return newState;
    case 'set_delivery_address':
      newState = update(state, { delivery: { $merge: payload } });
      return newState;
    default:
      throw new Error();
  }
}

export default function OrderProvider({ children }) {
  const [cart, dispatchCart] = React.useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart, dispatchCart }}>
      {children}
    </CartContext.Provider>
  );
}
