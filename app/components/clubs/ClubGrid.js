import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ClubCard from './ClubCard';

export default function ClubGrid({
  title = 'List of clubs',
  clubs = [],
  onView, // make sure we accept it
}) {
  const renderCard = ({ item }) => (
    <View style={styles.cardWrap}>
      <ClubCard club={item} onView={onView} />
    </View>
  );

  return (
    <View style={styles.wrap}>
      {!!title && <Text style={styles.title}>{String(title)}</Text>}

      <FlatList
        data={Array.isArray(clubs) ? clubs : []}
        keyExtractor={(item, i) => (item?.id != null ? String(item.id) : String(i))}
        numColumns={2}
        renderItem={renderCard}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<Text style={styles.empty}>No clubs yet.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#F9FAFB', padding: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  column: { gap: 12 },
  content: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 12 },
  cardWrap: { flex: 1, marginBottom: 12 },
});
