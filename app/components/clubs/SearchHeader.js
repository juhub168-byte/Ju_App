// components/clubs/SearchHeader.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchHeader({
  value,
  onChange,
  title = 'Clubs',
  placeholder = 'Search...',
}) {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
          />
          {!!value && (
            <TouchableOpacity style={styles.clearButton} onPress={() => onChange('')}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  searchContainer: { marginBottom: 12 },
  searchInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: {
    flex: 1,
    height: 44,
    paddingLeft: 40,
    paddingRight: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButton: { position: 'absolute', right: 10, padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
});
