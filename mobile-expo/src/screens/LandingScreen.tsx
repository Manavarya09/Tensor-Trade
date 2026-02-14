import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import BrutalistButton from '../components/BrutalistButton';

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
            <View style={styles.logoBox}>
                <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={styles.brandText}>TENSOR<Text style={styles.textOrange}>TRADE</Text></Text>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>VERSION 2.0 NOW LIVE</Text>
            </View>
            <Text style={styles.heroTitle}>
                AI POWERED{'\n'}
                <Text style={styles.heroTitleOrange}>TRADING</Text>
            </Text>
            <View style={styles.divider} />
            <Text style={styles.heroSubtitle}>
                SELF-IMPROVING MULTI-AGENT SYSTEM. ANALYZES MARKETS. MANAGES PORTFOLIOS. ZERO EMOTIONS. PURE LOGIC.
            </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
            <BrutalistButton
                title="START TRADING NOW"
                onPress={() => navigation.navigate('Auth')}
                variant="primary"
                style={styles.mainButton}
            />
            <BrutalistButton
                title="EXPLORE PRODUCTS"
                onPress={() => navigation.navigate('Auth')}
                variant="outline"
            />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>ASSETS</Text>
                <Text style={styles.statValue}>$2.5B+</Text>
            </View>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>USERS</Text>
                <Text style={styles.statValue}>50K+</Text>
            </View>
        </View>

        {/* Market Feed Preview */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>LIVE MARKET FEED</Text>
                <View style={styles.liveIndicator} />
            </View>
            <View style={styles.marketCard}>
                <View style={styles.marketRow}>
                    <Text style={styles.marketSymbol}>BTC/USD</Text>
                    <Text style={styles.marketPrice}>$64,230</Text>
                </View>
                <View style={styles.marketRow}>
                    <Text style={styles.marketLabel}>24H CHANGE</Text>
                    <Text style={styles.marketChangePositive}>+2.4%</Text>
                </View>
                <View style={styles.graphPlaceholder}>
                    {/* Simple CSS-like bars to simulate graph */}
                    {[40, 60, 45, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                        <View key={i} style={[styles.bar, { height: `${h}%` }]} />
                    ))}
                </View>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FF5722',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  textOrange: {
    color: '#FF5722',
  },
  heroTitleOrange: {
    color: '#FFFFFF',
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroSection: {
    marginBottom: 40,
  },
  badge: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  badgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
    marginBottom: 24,
    color: '#000',
  },
  divider: {
    height: 4,
    backgroundColor: '#000',
    width: '100%',
    marginBottom: 24,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 22,
    textAlign: 'center',
  },
  actionContainer: {
    gap: 16,
    marginBottom: 48,
  },
  mainButton: {
    shadowColor: '#FF5722',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  statBox: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#000',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF5722',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  liveIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#00FF00', // Green
    borderWidth: 2,
    borderColor: '#000',
  },
  marketCard: {
    borderWidth: 4,
    borderColor: '#000',
    padding: 16,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  marketSymbol: {
    fontSize: 18,
    fontWeight: '900',
  },
  marketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  marketLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  marketChangePositive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008000', // Darker green for visibility
  },
  graphPlaceholder: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  bar: {
    width: '8%',
    backgroundColor: '#000',
  },
});
