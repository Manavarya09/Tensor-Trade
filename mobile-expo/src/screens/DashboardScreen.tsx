import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import BrutalistCard from '../components/BrutalistCard';

export default function DashboardScreen() {
  const portfolioStats = [
    { label: 'Total Value', value: '$125,430.50', change: '+12.5%' },
    { label: "Today's Gain", value: '+$2,340.20', change: '+1.9%' },
    { label: 'Investments', value: '$100K', change: '15 stocks' },
    { label: 'Total Return', value: '+$25K', change: '+25.4%' }
  ];

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', value: '$8,771.50', change: '+2.3%', shariah: true },
    { symbol: 'MSFT', name: 'Microsoft', value: '$11,367.30', change: '+1.8%', shariah: true },
    { symbol: 'GOOGL', name: 'Alphabet', value: '$3,545.00', change: '-0.5%', shariah: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', value: '$9,940.00', change: '+3.2%', shariah: true },
    { symbol: 'NVDA', name: 'NVIDIA', value: '$52,516.80', change: '+5.1%', shariah: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerSubtitle}>WELCOME BACK, USER</Text>
                <Text style={styles.headerTitle}>DASHBOARD</Text>
            </View>
          <View style={styles.statusIndicator}>
             <View style={styles.statusDot} />
             <Text style={styles.statusText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {portfolioStats.map((stat, index) => (
            <View key={index} style={styles.statCardContainer}>
                 <View style={styles.statCard}>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={[styles.statChange, stat.change.includes('+') ? styles.textGreen : styles.textRed]}>{stat.change}</Text>
                </View>
                <View style={styles.cardShadow} />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HOLDINGS</Text>
            <View style={styles.sectionLine} />
        </View>

        <View style={styles.holdingsContainer}>
            {holdings.map((item, index) => (
                <View key={index} style={styles.holdingCard}>
                    <View style={styles.holdingHeader}>
                        <View>
                            <Text style={styles.holdingSymbol}>{item.symbol}</Text>
                            <Text style={styles.holdingName}>{item.name}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.holdingValue}>{item.value}</Text>
                            <Text style={[styles.holdingChange, item.change.includes('+') ? styles.textGreen : styles.textRed]}>{item.change}</Text>
                        </View>
                    </View>
                    <View style={styles.badgeContainer}>
                         <View style={[styles.badge, item.shariah ? styles.badgeBlack : styles.badgeOrange]}>
                             <Text style={[styles.badgeText, item.shariah ? styles.textWhite : styles.textBlack]}>
                                 {item.shariah ? 'SHARIAH COMPLIANT' : 'NON-COMPLIANT'}
                             </Text>
                         </View>
                    </View>
                </View>
            ))}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    paddingBottom: 16,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#666',
      marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    backgroundColor: '#FFF',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#00FF00', // Green
    borderWidth: 1,
    borderColor: '#000',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCardContainer: {
      width: '48%',
      marginBottom: 16,
      height: 100,
  },
  statCard: {
    borderWidth: 3,
    borderColor: '#000',
    padding: 12,
    backgroundColor: '#FFF',
    zIndex: 2,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardShadow: {
      position: 'absolute',
      top: 4,
      left: 4,
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      zIndex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  statChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textGreen: {
      color: '#008000',
  },
  textRed: {
      color: '#FF0000',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginRight: 16,
  },
  sectionLine: {
      flex: 1,
      height: 4,
      backgroundColor: '#000',
  },
  holdingsContainer: {
      gap: 16,
  },
  holdingCard: {
      borderWidth: 3,
      borderColor: '#000',
      padding: 16,
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  holdingSymbol: {
    fontSize: 18,
    fontWeight: '900',
  },
  holdingName: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  holdingValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  holdingChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeContainer: {
      alignItems: 'flex-start',
      borderTopWidth: 2,
      borderTopColor: '#EEE',
      paddingTop: 8,
  },
  badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderWidth: 2,
      borderColor: '#000',
  },
  badgeBlack: {
      backgroundColor: '#000',
  },
  badgeOrange: {
      backgroundColor: '#FFF',
      borderColor: '#FF5722',
  },
  badgeText: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  textWhite: {
      color: '#FFF',
  },
  textBlack: {
      color: '#000',
  },
});
