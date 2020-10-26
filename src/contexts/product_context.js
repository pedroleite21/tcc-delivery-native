import * as React from 'react';

const ProductContext = React.createContext({});

export const useProductContext = () => React.useContext(ProductContext);

export default function ProductProvider({ children }) {
  const [options, setOptions] = React.useState({});

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

  return (
    <ProductContext.Provider
      value={{ initOption, getOptionValue, setOptionValue, isItemReady }}>
      {children}
    </ProductContext.Provider>
  );
}
