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
  const subheading = [];

  required && subheading.push('Requerido');
  minItems > 0 && subheading.push(`Mínimo: ${minItems}`);
  maxItems > 0 && subheading.push(`Máximo: ${maxItems}`);

  return (
    <View style={styles.titleView}>
      <Title>{children}</Title>
      {subheading.length > 0 && (
        <Subheading>{subheading.join(' • ')}</Subheading>
      )}
    </View>
  );
}

export function ItemOptionSingle(option) {
  const [checkedOp, setCheckedOp] = React.useState(undefined);
  const { id, name, items, required } = option;

  const { dispatchPrice, initOption, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const findIndex = (valueId) =>
    items.findIndex(({ id: itemId }) => itemId === valueId);

  const handleValueChange = (value) => {
    const oldI = findIndex(checkedOp);
    const newI = findIndex(value);
    const item = items[newI];
    const oldItem = items[oldI];

    const newValue = {
      id: value,
      name: item.name,
      qty: 1,
    };

    const newPrice = oldItem
      ? parseFloat(item.addPrice) - parseFloat(oldItem.addPrice)
      : item.addPrice;

    setCheckedOp(value);
    setOptionValue(id, [newValue], true);
    dispatchPrice({ type: 'add', payload: newPrice });
  };

  return (
    <>
      <ItemOptionTitle required={required}>{name}</ItemOptionTitle>
      <View style={styles.optionItems}>
        <RadioButton.Group value={checkedOp} onValueChange={handleValueChange}>
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

  const { dispatchPrice, initOption, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const isChecked = (itemId) => {
    const checked =
      checkedOps.findIndex((idState) => idState === itemId) !== -1;
    return checked ? 'checked' : 'unchecked';
  };

  const setChecked = (itemId, addPrice) => () => {
    let newChecked;
    const index = checkedOps.findIndex((idState) => idState === itemId);
    const checked = index !== -1;

    if (!checked) {
      if (checkedOps.length === maxItems) {
        return;
      }
      newChecked = update(checkedOps, { $push: [itemId] });
      dispatchPrice({ type: 'add', payload: addPrice });
    } else {
      newChecked = update(checkedOps, { $splice: [[index, 1]] });
      dispatchPrice({ type: 'remove', payload: addPrice });
    }

    const checkedContext = newChecked.map((v) => {
      const i = items.findIndex(({ id: idState }) => idState === v);
      const item = items[i];

      return {
        id: v,
        name: item.name,
        qty: 1,
      };
    });

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
            <Checkbox
              status={isChecked(itemId)}
              onPress={setChecked(itemId, addPrice)}
            />
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

  const onPressRemove = () => onChange?.(id, qty - 1, true);

  const onPressAdd = () => onChange?.(id, qty + 1, false);

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

  const { dispatchPrice, initOption, setOptionValue } = useProductContext();

  React.useEffect(() => {
    initOption?.(option);
  }, []);

  const quantity = range.reduce((acc, { qty }) => acc + qty, 0);
  const full = maxItems ? quantity >= maxItems : false;

  const findIndex = (rangeId) => range.findIndex(({ id }) => id === rangeId);

  const handleChange = (id, qty, remove, addPrice, itemName) => {
    const index = findIndex(id);

    let newRange;
    if (index === -1) {
      newRange = update(range, { $push: [{ id, name: itemName, qty }] });
      dispatchPrice({ type: 'add', payload: addPrice });
    } else {
      if (qty > 0) {
        newRange = update(range, { [index]: { $merge: { qty } } });

        const type = remove ? 'remove' : 'add';
        dispatchPrice({ type, payload: addPrice });
      } else {
        newRange = update(range, { $splice: [[index, 1]] });
        dispatchPrice({ type: 'remove', payload: addPrice });
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
              onChange={(...args) => handleChange(...args, addPrice, itemName)}
              qty={findQty(itemId)}
              name={itemName}
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
