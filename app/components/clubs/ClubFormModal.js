import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ClubFormModal({ visible, mode = 'create', initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValues);

  React.useEffect(() => { setForm(initialValues); }, [initialValues, visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo library access.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.9, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) setForm(prev => ({ ...prev, image: res.assets[0].uri }));
  };

  const submit = () => {
    if (!form.name?.trim()) return Alert.alert('Club name is required');
    onSubmit({ name: form.name.trim(), leader: form.leader?.trim() ?? '', about: form.about ?? '', image: form.image ?? null, members: Number(form.members ?? 0) });
    onClose?.();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{mode === 'edit' ? 'Edit club' : 'Create new club'}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color="#6B7280" /></TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <Field label="Club Name">
              <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Title" placeholderTextColor="#9AA0A6" />
            </Field>

            <Field label="Club Leader">
              <TextInput style={styles.input} value={form.leader} onChangeText={(t) => setForm({ ...form, leader: t })} placeholder="Leader" placeholderTextColor="#9AA0A6" />
            </Field>

            <Field label="Add Image Club">
              <TouchableOpacity style={styles.upload} onPress={pickImage}>
                {form.image ? (
                  <Image source={{ uri: form.image }} style={{ width: 120, height: 120, borderRadius: 10 }} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
                    <Text style={styles.upText}>Upload</Text>
                  </>
                )}
              </TouchableOpacity>
            </Field>

            <Field label="About Club">
              <TextInput
                style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
                value={form.about}
                onChangeText={(t) => setForm({ ...form, about: t })}
                placeholder="About"
                placeholderTextColor="#9AA0A6"
                multiline
              />
            </Field>

            <Field label="Members (optional)">
              <TextInput
                style={styles.input}
                value={String(form.members ?? 0)}
                onChangeText={(t) => setForm({ ...form, members: t.replace(/[^0-9]/g, '') })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9AA0A6"
              />
            </Field>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.primary} onPress={submit}><Text style={styles.primaryText}>{mode === 'edit' ? 'Edit' : 'Create'}</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.65)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  sheet: { width: '100%', backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  label: { fontSize: 13, color: '#374151', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, height: 46, color: '#111827' },
  upload: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', borderRadius: 12, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 6 },
  upText: { color: '#6B7280', fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  cancel: { flex: 1, backgroundColor: '#E7EBF1', borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  cancelText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  primary: { flex: 1, backgroundColor: '#2563EB', borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
