import * as React from 'react';

const ProductContext = React.createContext({});

export const useProductContext = () => React.useContext(ProductContext);

function parseValue(payload) {
  const value = typeof payload === 'string' ? payload.trim() : payload;
  return parseFloat(value);
}

function priceReducer(state, action) {
  const { type, payload } = action;
  const value = parseValue(payload);
  switch (type) {
    case 'add':
      return state + value;
    case 'remove':
      return state - value;
    case 'init':
      return value;
    default:
      throw new Error();
  }
}

export default function ProductProvider({ children }) {
  const [itemQty, setItemQty] = React.useState(1);
  const [options, setOptions] = React.useState({});
  const [price, dispatchPrice] = React.useReducer(priceReducer, 0.0);

  const setOptionValue = React.useCallback((id, value, able) => {
    setOptions((prevOptions) => {
      const op = prevOptions[id];
      op.value = value;
      if (typeof able === 'boolean') {
        op.able = able;
      }
      return { ...prevOptions, [id]: op };
    });
  }, []);

  const getOptionValue = React.useCallback(
    (id) => options[id] && options[id].value,
    [options],
  );

  const initOption = React.useCallback((op) => {
    const { id, required } = op;
    const newOption = {
      [id]: {
        able: !required,
        value: [],
      },
    };

    setOptions((prevOptions) => ({ ...prevOptions, ...newOption }));
  }, []);

  const isItemReady = React.useMemo(
    () => !Object.keys(options).some((v) => !options[v].able),
    [options],
  );

  const prepareItemsForOrder = () => {
    let renderedOptions = [];

    Object.keys(options).forEach((v) => {
      const { value } = options[v];
      renderedOptions = renderedOptions.concat(value);
    });

    return {
      itemPrice: price.toFixed(2),
      options: renderedOptions,
      qty: itemQty,
    };
  };

  return (
    <ProductContext.Provider
      value={{
        dispatchPrice,
        getOptionValue,
        initOption,
        isItemReady,
        itemQty,
        prepareItemsForOrder,
        price,
        setItemQty,
        setOptionValue,
      }}>
      {children}
    </ProductContext.Provider>
  );
}
