import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteConfirmModal({ visible, title, message, confirmText = 'Delete', onCancel, onConfirm }) {
  return (
    //delete confirmation modal
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}><Ionicons name="trash-outline" size={28} color="#DC2626" /></View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.danger]} onPress={onConfirm}>
              <Text style={styles.btnText}>{confirmText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={[styles.btnText, { color: '#374151' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.65)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', gap: 10 },
  iconWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  text: { textAlign: 'center', color: '#6B7280' },
  row: { flexDirection: 'row', gap: 12, marginTop: 10 },
  btn: { flex: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  danger: { backgroundColor: '#DC2626' },
  cancel: { backgroundColor: '#E7EBF1' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
