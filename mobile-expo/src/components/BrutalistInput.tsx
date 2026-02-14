import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';

interface BrutalistInputProps extends TextInputProps {
  label?: string;
}

export default function BrutalistInput({ label, style, ...props }: BrutalistInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#000',
  },
  input: {
    height: 50,
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});
