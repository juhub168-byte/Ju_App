import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ClubViewModal({ visible, club, onClose }) {
  if (!visible || !club) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center' }}>
            {club.image ? (
              <Image source={{ uri: club.image }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#e5e7eb' }]} />
            )}
            <Text style={styles.title}>{club.name || 'Untitled club'}</Text>
            {club.leader ? <Text style={styles.sub}>Leader: {club.leader}</Text> : null}
            <Text style={styles.sub}>Members: {club.members ?? 0}</Text>
          </View>

          <Text style={styles.section}>About</Text>
          <Text style={styles.body}>{club.about || '—'}</Text>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(17,24,39,0.65)',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    width: '100%', backgroundColor: '#fff',
    borderRadius: 16, padding: 20, gap: 10,
  },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  title: { marginTop: 10, fontSize: 18, fontWeight: '700', color: '#111827' },
  sub: { color: '#6b7280', marginTop: 2 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 14, color: '#111827' },
  body: { color: '#374151', marginTop: 6, lineHeight: 20 },
  closeBtn: {
    marginTop: 16, backgroundColor: '#2563EB',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  closeTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
