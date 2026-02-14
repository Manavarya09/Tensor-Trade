import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BrutalistButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function BrutalistButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}: BrutalistButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return '#FF5722'; // Orange
      case 'secondary': return '#FFFFFF'; // White
      case 'outline': return '#FFFFFF';
      default: return '#FF5722';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return '#000000';
      case 'outline': return '#000000';
      default: return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), borderColor: '#000000' },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    // Brutalist shadow effect (hard shadow)
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
