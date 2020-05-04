import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import { colors } from '../styles';

export default function RNSButton(props) {
  let icon;
  if (props.icon) {
    icon = (
      <Image resizeMode="contain" source={props.icon} style={styles.icon} />
    );
  }

  const borderedStyle = [
    styles.button,
    props.small && styles.buttonSmall,
    styles.border,
    props.primary && {
      borderColor: colors.primary,
    },
    props.secondary && {
      borderColor: colors.secondary,
    },
    props.bgColor && {
      borderColor: props.bgColor,
    },
    props.rounded && styles.rounded,
  ];
  const textStyle = [
    styles.caption,
    props.small && styles.captionSmall,
    styles.secondaryCaption,
    icon && styles.captionWithIcon,
    props.primary && {
      color: colors.primary,
    },
    props.secondary && {
      color: colors.secondary,
    },
    props.bgColor && {
      color: props.bgColor,
    },
    props.textColor && {
      color: props.textColor,
    },
  ];

  return (
    <TouchableOpacity
      accessibilityTraits="button"
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        props.small && styles.containerSmall,
        props.large && styles.containerLarge,
        props.style,
      ]}
    >
      <View
        style={[
          styles.button,
          props.small && styles.buttonSmall,
          styles.border,
          { backgroundColor: props.bgColor },
          props.primary && {
            borderColor: colors.primary,
          },
          props.secondary && {
            borderColor: colors.secondary,
          },
          props.bgColor && {
            borderColor: props.bgColor,
          },
          props.rounded && styles.rounded,
        ]}
      >
        {icon && <View>{icon}</View>}
        <Text style={[textStyle, props.textStyle]}>{props.caption} </Text>
        {
          props.isLoading == true
            ? <ActivityIndicator animating={true} size="small" color="white" />
            : null
        }
      </View>
    </TouchableOpacity>
  );
}

const HEIGHT = 40;
const HEIGHT_SMALL = 30;
const HEIGHT_LARGE = 50;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    // borderWidth: 1 / PixelRatio.get(),
  },
  containerSmall: {
    height: HEIGHT_SMALL,
  },
  containerLarge: {
    height: HEIGHT_LARGE,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  buttonSmall: {
    paddingHorizontal: 0,
  },
  border: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  rounded: {
    borderRadius: HEIGHT_LARGE / 2,
  },
  icon: {
    maxHeight: HEIGHT - 20,
    maxWidth: HEIGHT - 20,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 15,
  },
  captionSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  captionWithIcon: {
    marginLeft: 12,
  },
  primaryCaption: {
    color: 'white',
  },
  secondaryCaption: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  action: {
    borderRadius: 20,
    height: HEIGHT,
    width: HEIGHT,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
