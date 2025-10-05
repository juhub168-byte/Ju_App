import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

function Checkbox({ checked, onToggle }) {
  return (
    <TouchableOpacity onPress={onToggle} style={[styles.cb, checked && styles.cbOn]}>
      {checked ? <View style={styles.cbDot} /> : null}
    </TouchableOpacity>
  );
}

export default function QueueTable({
  data = [],
  onApprove,        // (id) => void  single
  onReject,         // (id) => void  single
  onApproveMany,    // (ids[]) => void  bulk
  onRejectMany,     // (ids[]) => void  bulk
}) {
  const [selected, setSelected] = useState(new Set());

  const allIds = useMemo(() => data.map(i => i.id), [data]);
  const allSelected = selected.size > 0 && selected.size === data.length;

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(prev => {
      if (prev.size === data.length) return new Set();
      return new Set(allIds);
    });
  };

  const handleApproveMany = () => {
    if (selected.size === 0 || !onApproveMany) return;
    onApproveMany(Array.from(selected));
    setSelected(new Set());
  };

  const handleRejectMany = () => {
    if (selected.size === 0 || !onRejectMany) return;
    onRejectMany(Array.from(selected));
    setSelected(new Set());
  };

  const renderItem = ({ item }) => {
    const isChecked = selected.has(item.id);
    return (
      <View style={styles.row}>
        {/* Check */}
        <View style={[styles.cBox, { flex: 0.6 }]}>
          <Checkbox checked={isChecked} onToggle={() => toggle(item.id)} />
        </View>

        {/* Student */}
        <Text style={[styles.c, { flex: 1.2 }]}>{item.student}</Text>

        {/* Batch */}
        <Text style={[styles.c, { flex: 1 }]}>{item.batch}</Text>

        {/* Request */}
        <Text style={[styles.c, { flex: 1.5 }]}>{item.request}</Text>

        {/* Actions */}
        <View style={[styles.actions, { width: 130 }]}>
          <TouchableOpacity style={[styles.btn, styles.approve]} onPress={() => onApprove && onApprove(item.id)}>
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.deny]} onPress={() => onReject && onReject(item.id)}>
            <Text style={styles.btnText}>Deny</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrap}>
      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <View style={styles.bulkBar}>
          <Text style={styles.bulkText}>{selected.size} selected</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.bulkBtn, styles.approve]} onPress={handleApproveMany}>
              <Text style={styles.bulkBtnText}>Approve Selected</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bulkBtn, styles.deny]} onPress={handleRejectMany}>
              <Text style={styles.bulkBtnText}>Deny Selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.cBox, { flex: 0.6 }]}>
          <Checkbox checked={allSelected} onToggle={toggleAll} />
        </View>
        <Text style={[styles.h, { flex: 1.2 }]}>Student</Text>
        <Text style={[styles.h, { flex: 1 }]}>Batch</Text>
        <Text style={[styles.h, { flex: 1.5 }]}>Club Request</Text>
        <Text style={[styles.h, { width: 130, textAlign: 'center' }]}>Action</Text>
      </View>

      {/* Rows */}
      <FlatList
        data={data}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No pending approvals.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#F9FAFB', padding: 14, borderRadius: 10 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 12,
    borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 1, borderColor: '#E5E7EB'
  },
  h: { color: '#808288', fontWeight: '700', fontSize: 12 },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 12,
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB'
  },

  c: { color: '#0B1020', fontWeight: '600' },
  cBox: { alignItems: 'flex-start', justifyContent: 'center' },

  actions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, minWidth: 84, alignItems: 'center' },
  approve: { backgroundColor: '#16A34A' },
  deny: { backgroundColor: '#DC2626' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // bulk bar
  bulkBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, marginBottom: 10
  },
  bulkText: { color: '#111827', fontWeight: '700' },
  bulkBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  bulkBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // checkbox visuals
  cb: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
  },
  cbOn: { borderColor: '#2563EB', backgroundColor: '#2563EB' },
  cbDot: { width: 10, height: 10, borderRadius: 3, backgroundColor: '#fff' },

  empty: { textAlign: 'center', color: '#6B7280', marginTop: 14 },
});
