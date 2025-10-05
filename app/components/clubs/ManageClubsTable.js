import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageClubsTable({
  data = [],
  searchQuery,
  onCreate,
  onEdit,
  onDelete,
  onView, // NEW
}) {
  return (
    <View>
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={[styles.h, { flex: 1.6 }]}>Club Name</Text>
        <Text style={[styles.h, { flex: 1.2 }]}>Leader</Text>
        <Text style={[styles.h, { flex: 0.9 }]}>Members</Text>
        <Text style={[styles.h, { width: 160, textAlign: 'center' }]}>Action</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.c, { flex: 1.6 }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.c, { flex: 1.2 }]} numberOfLines={1}>{item.leader || '—'}</Text>
            <Text style={[styles.c, { flex: 0.9 }]}>{item.members ?? 0}</Text>

            <View style={[styles.actions, { width: 160 }]}>
              <TouchableOpacity onPress={() => onEdit && onEdit(item)} style={[styles.iconBtn, { backgroundColor: '#16A34A' }]}>
                <Ionicons name="create-outline" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete && onDelete(item)} style={[styles.iconBtn, { backgroundColor: '#DC2626' }]}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onView && onView(item)} style={[styles.iconBtn, { backgroundColor: '#2563EB' }]}>
                <Ionicons name="information-circle-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No clubs yet.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      
    </View>
    <TouchableOpacity
        style={styles.createBtn}
        onPress={onCreate}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <Text style={styles.createTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 12,
  },
  h: { color: '#808288', fontWeight: '700', fontSize: 12 },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 12,
    borderTopWidth: 1, borderTopColor: '#EEF1F5',
  },
  c: { color: '#0B1020', fontWeight: '600' },

  actions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  iconBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, alignItems: 'center' },

  empty: { textAlign: 'center', color: '#6B7280', marginTop: 14 },

createBtn: {
  // right side
  alignSelf: 'flex-end',
  marginRight: 12,
  marginTop: 12,

  // size & shape
  width: 70,
  height: 54,
  backgroundColor: '#2563EB',
  borderRadius: 12,

  // center the plus
  alignItems: 'center',
  justifyContent: 'center',

  // subtle shadow (Android uses elevation)
  shadowColor: '#2563EB',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
},
createTxt: {
  color: '#fff',
  fontWeight: '900',
  fontSize: 30,      // << bigger “+”
  lineHeight: 30,    // keeps it visually centered
  textAlign: 'center'
},

});
