import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const cards = [
    { title: 'Total Clubs', number: 9, icon: 'people-outline', link: 'See all' },
    { title: 'Total Channels', number: 12, icon: 'chatbubble-ellipses-outline', link: 'See all' },
    { title: 'Total Announcements', number: 4, icon: 'megaphone-outline', link: 'See all' },
    { title: 'Requests Pending', number: 2, icon: 'time-outline', link: 'Review requests' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>JuHub Admin</Text>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.grid}>
        {cards.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} activeOpacity={0.8}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={30} color="#3b82f6" />
            </View>
            <Text style={styles.cardNumber}>{item.number}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.link}>{item.link}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff', // keep clean white background
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,

    // glowing shadow
    shadowColor: '#3b82f6',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  iconWrapper: {
    backgroundColor: '#eff6ff',
    borderRadius: 50,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 6,
  },
  link: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
});
