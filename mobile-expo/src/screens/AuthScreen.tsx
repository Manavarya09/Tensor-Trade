import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistInput from '../components/BrutalistInput';

export default function AuthScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock auth
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
              <View style={styles.tag}>
                  <Text style={styles.tagText}>SECURE ACCESS</Text>
              </View>
              <Text style={styles.title}>IDENTIFY</Text>
              <Text style={styles.subtitle}>ENTER CREDENTIALS TO ACCESS TERMINAL.</Text>
          </View>

          <View style={styles.card}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <BrutalistInput
                        placeholder="USER@DOMAIN.COM"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <BrutalistInput
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <BrutalistButton
                    title="ACCESS TERMINAL"
                    onPress={handleLogin}
                    variant="primary"
                    style={{ marginTop: 24, shadowColor: '#FF5722' }}
                />
              </View>
          </View>

          <BrutalistButton
              title="BACK TO MAINFRAME"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={{ marginTop: 16 }}
            />

            <Text style={styles.footerText}>SYSTEM ID: TENSOR-NODE-01 // v2.4.1</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  tag: {
      backgroundColor: '#FF5722',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 2,
      borderColor: '#000',
      marginBottom: 16,
  },
  tagText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#666',
      textAlign: 'center',
  },
  card: {
      borderWidth: 4,
      borderColor: '#000',
      padding: 24,
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
      marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
      marginBottom: 16,
  },
  label: {
      fontSize: 12,
      fontWeight: '900',
      marginBottom: 8,
      textTransform: 'uppercase',
  },
  footerText: {
      textAlign: 'center',
      marginTop: 32,
      fontWeight: 'bold',
      color: '#CCC',
      fontSize: 12,
  },
});
