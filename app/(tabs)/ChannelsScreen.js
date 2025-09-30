// App.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const channels = [
  { id: "1", name: "BATCH 14", count: 120, type: "Batch Channel" },
  { id: "2", name: "BATCH 13", count: 130, type: "Batch Channel" },
  { id: "3", name: "BATCH 12", count: 80, type:  "Batch Channel" },
  { id: "4", name: "BATCH 15", count: 140, type: "Batch Channel" },
  { id: "5", name: "BATCH 14", count: 120, type: "Batch Channel" },
  { id: "6", name: "BATCH 13", count: 130, type: "Batch Channel" },
  { id: "7", name: "BATCH 12", count: 80, type:  "Batch Channel" },
  { id: "8", name: "BATCH 15", count: 140, type: "Batch Channel" },
  { id: "9", name: "BATCH 14", count: 120, type: "Batch Channel" },
  { id: "10", name: "BATCH 13", count: 130, type: "Batch Channel" },
];

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.logo}>JU HUB</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SearchHeader({ searchQuery, setSearchQuery }) {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search channels..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.headerTitle}>Manage Channels</Text>
    </View>
  );
}

function TableHeader() {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderText, styles.columnChannelName]}>Channel Name</Text>
      <Text style={[styles.tableHeaderText, styles.columnMembers]}>Members</Text>
      <Text style={[styles.tableHeaderText, styles.columnType]}>Type</Text>
      <Text style={[styles.tableHeaderText, styles.columnActions]}>Actions</Text>
    </View>
  );
}

function ChannelRow({ channel, isActive, onPress }) {
  return (
    <TouchableOpacity 
      style={[
        styles.channelRow,
        isActive && styles.activeChannelRow
      ]} 
      onPress={() => onPress(channel.id)}
    >
      <Text style={[
        styles.channelText, 
        styles.columnChannelName,
        isActive && styles.activeChannelText
      ]}>
        {channel.name}
      </Text>
      <Text style={[
        styles.channelText, 
        styles.columnMembers,
        isActive && styles.activeChannelText
      ]}>
        {channel.count}
      </Text>
      <Text style={[
        styles.channelText, 
        styles.columnType,
        isActive && styles.activeChannelText
      ]}>
        {channel.type}
      </Text>
      <View style={[styles.channelActions, styles.columnActions]}>
        <TouchableOpacity style={[styles.channelButton, styles.settingButton]}>
          <Text style={styles.buttonText}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.channelButton, styles.viewButton]}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ChannelList({ searchQuery, activeChannel, setActiveChannel }) {
  // Filter channels based on search query
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChannelPress = (channelId) => {
    setActiveChannel(channelId === activeChannel ? null : channelId);
  };

  return (
    <View style={styles.channelListContainer}>
      <View style={styles.channelList}>
        <TableHeader />
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <ChannelRow 
              key={`${channel.id}-${index}`} 
              channel={channel}
              isActive={activeChannel === channel.id}
              onPress={handleChannelPress}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noResultsText}>No channels found</Text>
            <Text style={styles.noResultsSubText}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </View>
      
      {/* Search results info */}
      {searchQuery.length > 0 && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchInfoText}>
            Showing {filteredChannels.length} result{filteredChannels.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appContainer}>
        <Header />
        <SearchHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ChannelList 
            searchQuery={searchQuery}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  searchHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    position: 'relative',
    marginTop: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingLeft: 48,
    paddingRight: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 0,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  headerTitle: {
    marginTop: 23,
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  channelListContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  channelList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    minHeight: 200,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
  },
  tableHeaderText: {
    color: '#808288',
    fontWeight: '600',
    fontSize: 13,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 60,
  },
  activeChannelRow: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  channelText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
  },
  activeChannelText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  // Column widths for proper alignment
  columnChannelName: {
    flex: 2,
    textAlign: 'left',
  },
  columnMembers: {
    flex: 1,
    textAlign: 'center',
  },
  columnType: {
    flex: 1.5,
    textAlign: 'left',
  },
  columnActions: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingButton: {
    backgroundColor: '#062056',
  },
  viewButton: {
    backgroundColor: '#0C8806',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // New styles for search functionality
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  searchInfo: {
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  searchInfoText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
});
