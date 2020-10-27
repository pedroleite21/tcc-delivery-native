/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Caption,
  Checkbox,
  RadioButton,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
          <View key={itemName} style={styles.item}>
            <Checkbox status={isChecked(itemId)} onPress={setChecked(itemId)} />
            <Subheading style={styles.itemTitle}>{itemName}</Subheading>
            <Caption>+ R$ {addPrice}</Caption>
          </View>
        ))}
      </View>
    </>
  );
}

function RangeOption({ qty = 0, full = false, onChange, id }) {
  const removeDisabled = qty === 0;
  const addDisabled = full;

  const onPressRemove = () => onChange?.(id, qty - 1);

  const onPressAdd = () => onChange?.(id, qty + 1);

  return (
    <View style={styles.rangeView}>
      <TouchableOpacity
        onPress={onPressRemove}
        disabled={removeDisabled}
        style={styles.rangeButton}>
        <Icon name="remove" size={20} />
      </TouchableOpacity>
      <Text>{qty}</Text>
      <TouchableOpacity
        onPress={onPressAdd}
        disabled={addDisabled}
        style={styles.rangeButton}>
        <Icon name="add" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export function ItemOptionRange(option) {
  const [range, setRange] = React.useState([]);
  const { name, items, required, minItems, maxItems, id: optionId } = option;

  const { initOption, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const quantity = range.reduce((acc, { qty }) => acc + qty, 0);
  const full = maxItems ? quantity >= maxItems : false;

  const findIndex = (rangeId) => range.findIndex(({ id }) => id === rangeId);

  const handleChange = (id, qty) => {
    const index = findIndex(id);

    let newRange;
    if (index === -1) {
      newRange = update(range, { $push: [{ id, qty }] });
    } else {
      if (qty > 0) {
        newRange = update(range, { [index]: { $merge: { qty } } });
      } else {
        newRange = update(range, { $splice: [[index, 1]] });
      }
    }

    const able = required ? quantity > minItems : true;
    setOptionValue(optionId, newRange, able);
    setRange(newRange);
  };

  const findQty = (id) => {
    const index = findIndex(id);

    if (index !== -1) {
      return range[index].qty;
    } else {
      return 0;
    }
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
          <View key={itemName} style={styles.item}>
            <RangeOption
              full={full}
              id={itemId}
              onChange={handleChange}
              qty={findQty(itemId)}
            />
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
  rangeView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
  },
  rangeButton: {
    padding: 4,
  },
  iconDisabled: {
    color: '#666',
  },
});
