import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface BrutalistCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function BrutalistCard({ children, style }: BrutalistCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});
