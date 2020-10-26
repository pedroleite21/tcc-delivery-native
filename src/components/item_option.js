/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Checkbox,
  RadioButton,
  Subheading,
  Title,
} from 'react-native-paper';
import update from 'immutability-helper';
import { useProductContext } from '../contexts/product_context';

function ItemOptionTitle({ children, required, minItems = 0, maxItems = 0 }) {
  return (
    <View style={styles.titleView}>
      <Title>{children}</Title>
      {required && <Subheading>Requerido</Subheading>}
    </View>
  );
}

export function ItemOptionSingle(option) {
  const { id, name, items, required } = option;

  const { initOption, getOptionValue, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const handleValueChange = (value) => {
    const newValue = {
      id: value,
      qty: 1,
    };

    setOptionValue(id, [newValue], true);
  };

  const opValue = getOptionValue(id);
  const value = opValue && opValue[0] && opValue[0].id;

  return (
    <>
      <ItemOptionTitle required={required}>{name}</ItemOptionTitle>
      <View style={styles.optionItems}>
        <RadioButton.Group value={value} onValueChange={handleValueChange}>
          {items.map(({ name: itemName, id: itemId, addPrice }) => (
            <View key={itemName} style={styles.item}>
              <RadioButton value={itemId} />
              <Subheading style={styles.itemTitle}>{itemName}</Subheading>
              <Caption>+ R$ {addPrice}</Caption>
            </View>
          ))}
        </RadioButton.Group>
      </View>
    </>
  );
}

export function ItemOptionMultiple(option) {
  const [checkedOps, setCheckedOps] = React.useState([]);
  const { id, items, maxItems, minItems, name, required } = option;

  const { initOption, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const isChecked = (itemId) => {
    const checked =
      checkedOps.findIndex((idState) => idState === itemId) !== -1;
    return checked ? 'checked' : 'unchecked';
  };

  const setChecked = (itemId) => () => {
    let newChecked;
    const index = checkedOps.findIndex((idState) => idState === itemId);
    const checked = index !== -1;

    if (!checked) {
      if (checkedOps.length === maxItems) {
        return;
      }
      newChecked = update(checkedOps, { $push: [itemId] });
    } else {
      newChecked = update(checkedOps, { $splice: [[index, 1]] });
    }

    const checkedContext = newChecked.map((v) => ({
      id: v,
      qty: 1,
    }));

    const able = required
      ? newChecked.length >= minItems && newChecked.length <= maxItems
      : true;
    setCheckedOps(newChecked);
    setOptionValue(id, checkedContext, able);
  };

  return (
    <>
      <ItemOptionTitle
        required={required}
        minItems={minItems}
        maxItems={maxItems}>
        {name}
      </ItemOptionTitle>
      <View style={styles.optionItems}>
        {items.map(({ id: itemId, name: itemName, addPrice }) => (
          <View style={styles.item}>
            <Checkbox status={isChecked(itemId)} onPress={setChecked(itemId)} />
            <Subheading style={styles.itemTitle}>{itemName}</Subheading>
            <Caption>+ R$ {addPrice}</Caption>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleView: {
    backgroundColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    flexGrow: 1,
  },
  optionItems: {
    padding: 16,
  },
});
