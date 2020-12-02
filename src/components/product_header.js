import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Headline, Paragraph, Subheading } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';

export default function ProductHeader({ basePrice, description, image, name }) {
  const { top } = useSafeAreaInsets();
  const { canGoBack, goBack } = useNavigation();

  const _goBack = () => goBack();

  return (
    <>
      <View style={styles.root}>
        {image && (
          <Image
            style={styles.image}
            source={{
              uri: image,
            }}
          />
        )}
        <View style={[styles.topView, top && { paddingTop: 16 + top }]}>
          {canGoBack() && (
            <TouchableOpacity style={styles.backButton} onPress={_goBack}>
              <Icon size={24} name="arrow-back" color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.content}>
        <Headline style={styles.contentSpacing}>{name}</Headline>
        {typeof description === 'string' && description !== '' && (
          <Paragraph style={styles.contentSpacing}>{description}</Paragraph>
        )}
        <Subheading>R$ {basePrice}</Subheading>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: 'gray',
  },
  image: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  topView: {
    padding: 16,
    flexDirection: 'row',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#d81b60',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    padding: 16,
  },
  contentSpacing: {
    marginBottom: 8,
  },
});
