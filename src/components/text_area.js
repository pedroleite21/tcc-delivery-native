import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Caption, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TextArea({ onChange }) {
  const [value, setValue] = React.useState('');

  const handleChange = (text) => {
    if (text.length <= 180) {
      setValue(text);
      onChange?.(text);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleView}>
        <Icon name="chat" size={24} style={styles.iconSpace} />
        <Title>Alguma observação?</Title>
      </View>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={5}
        onChangeText={handleChange}
        value={value}
      />
      <Caption style={styles.caption}>{value.length}/180</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopColor: '#ddd',
    borderTopWidth: 2,
    flexDirection: 'column',
    padding: 16,
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconSpace: {
    marginRight: 8,
  },
  caption: {
    paddingTop: 8,
    textAlign: 'right',
  },
});
