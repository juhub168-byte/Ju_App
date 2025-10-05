import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const placeholder =
  'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=60';

export default function ClubCard({ club, onView }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: club.image || placeholder }} style={styles.cover} />
      <View style={{ padding: 12 }}>
        <Text numberOfLines={1} style={styles.name}>{club.name}</Text>
        <Text numberOfLines={2} style={styles.about}>{club.about || '—'}</Text>

        <View style={styles.row}>
          <View style={styles.badge}>
            <Ionicons name="people-outline" size={12} color="#0B3B9A" />
            <Text style={styles.badgeText}>{club.members ?? 0} members</Text>
          </View>

          <TouchableOpacity
            style={styles.cta}
            onPress={() => onView && onView(club)}
            accessibilityRole="button"
            accessibilityLabel={`See more about ${club.name}`}
          >
            <Text style={styles.ctaText}>See more</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EEF2F7',
    shadowColor: '#235FE3', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 5,
  },
  cover: { width: '100%', height: 110 },
  name: { fontSize: 14, fontWeight: '700', color: '#0B1020' },
  about: { marginTop: 4, fontSize: 12, color: '#6B7280' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F0FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, color: '#0B3B9A', fontWeight: '700' },
  cta: { marginLeft: 'auto', backgroundColor: '#1D4ED8', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  ctaText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
