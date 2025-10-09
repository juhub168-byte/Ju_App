import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  Animated,
  Modal,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Storage keys
const STORAGE_KEYS = {
  CHANNELS_DATA: 'channels_data',
};

const SettingsIcon = ({ size = 24, color = '#000' }) => (
  <Ionicons name="settings-sharp" size={size} color={color} />
);

const ViewIcon = ({ size = 24, color = '#000' }) => (
  <Ionicons name="eye-sharp" size={size} color={color} />
);

const DeleteIcon = ({ size = 24, color = '#000' }) => (
  <MaterialIcons name="delete" size={size} color={color} />
);

const CheckIcon = ({ size = 24, color = '#000' }) => (
  <MaterialIcons name="check" size={size} color={color} />
);

const ErrorIcon = ({ size = 24, color = '#000' }) => (
  <MaterialIcons name="error-outline" size={size} color={color} />
);

// Beautiful Delete Alert Component
function DeleteAlert({ visible, onClose, onConfirm, channelName }) {
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.deleteAlertOverlay}>
      <Animated.View style={[
        styles.deleteAlertContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim
        }
      ]}>
        <View style={styles.deleteIconContainer}>
          <MaterialIcons name="delete" size={48} color="#DC2626" />
        </View>
        <Text style={styles.deleteTitle}>Delete Channel</Text>
        <Text style={styles.deleteMessage}>
          Are you sure you want to delete "{channelName}"? This action cannot be undone.
        </Text>
        
        <View style={styles.deleteActions}>
          <TouchableOpacity 
            style={[styles.deleteButton, styles.cancelDeleteButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelDeleteText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.deleteButton, styles.confirmDeleteButton]}
            onPress={onConfirm}
          >
            <MaterialIcons name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.confirmDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// Beautiful Success Alert Component
function SuccessAlert({ visible, onClose, type = 'create' }) {
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [checkScale] = useState(new Animated.Value(0));
  const [progressScale] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]),
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(progressScale, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
      checkScale.setValue(0);
      progressScale.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isDelete = type === 'delete';
  const title = isDelete ? 'Deleted!' : 'Success!';
  const message = isDelete ? 'Channel has been deleted successfully' : 'Channel has been created successfully';
  const iconColor = isDelete ? '#DC2626' : '#0C8806';
  const iconName = isDelete ? 'check-circle' : 'check';

  return (
    <View style={styles.successAlertOverlay}>
      <Animated.View style={[
        styles.successAlertContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim
        }
      ]}>
        <View style={[styles.successIconContainer, { backgroundColor: iconColor }]}>
          <Animated.View style={[
            styles.successCheck,
            { transform: [{ scale: checkScale }] }
          ]}>
            <MaterialIcons name={iconName} size={36} color="#FFFFFF" />
          </Animated.View>
        </View>
        <Text style={[styles.successTitle, { color: iconColor }]}>{title}</Text>
        <Text style={styles.successMessage}>{message}</Text>
        <View style={styles.successProgressBar}>
          <Animated.View 
            style={[
              styles.successProgressFill,
              {
                transform: [{ scaleX: progressScale }],
                backgroundColor: iconColor
              }
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

function Header({ onAddPress, isLoading, onBackPress, showBackButton, title }) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <Animated.View style={animatedStyle}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBackPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={animatedStyle}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={onAddPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="add" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      
      {title && (
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}
      
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

function IconButton({ icon: Icon, onPress, backgroundColor, iconColor, size = 20, disabled = false }) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    if (!disabled) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(rotateAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg']
  });

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      { rotate: rotateInterpolate }
    ],
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.iconButtonWrapper, { backgroundColor }]}
    >
      <Animated.View style={[styles.iconButtonContainer, animatedStyle]}>
        <Icon size={size} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function ChannelRow({ channel, isActive, onPress, onSettingsPress, onViewPress, onDeletePress }) {
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
        <IconButton 
          icon={ViewIcon}
          onPress={() => onViewPress(channel)}
          backgroundColor="#0C8806"
          iconColor="#FFFFFF"
          size={18}
        />
        <IconButton 
          icon={SettingsIcon}
          onPress={() => onSettingsPress(channel)}
          backgroundColor="#062056"
          iconColor="#FFFFFF"
          size={18}
        />
        <IconButton 
          icon={DeleteIcon}
          onPress={() => onDeletePress(channel)}
          backgroundColor="#DC2626"
          iconColor="#FFFFFF"
          size={18}
        />
      </View>
    </TouchableOpacity>
  );
}

function CreateChannelModal({ visible, onClose, onCreateChannel }) {
  const [channelName, setChannelName] = useState('');
  const [members, setMembers] = useState('');
  const [type, setType] = useState('Batch Channel');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setChannelName('');
    setMembers('');
    setType('Batch Channel');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!channelName.trim()) {
      newErrors.channelName = 'Channel name is required';
    }

    if (!members.trim()) {
      newErrors.members = 'Members count is required';
    } else if (isNaN(members) || parseInt(members) <= 0) {
      newErrors.members = 'Members must be a valid number';
    }

    if (!type.trim()) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newChannel = {
        id: Date.now().toString(),
        name: channelName.trim(),
        count: parseInt(members),
        type: type.trim()
      };
      
      onCreateChannel(newChannel);
      resetForm();
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Channel</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Channel Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.channelName && styles.inputError
                  ]}
                  value={channelName}
                  onChangeText={setChannelName}
                  placeholder="Enter channel name"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.channelName && (
                  <View style={styles.errorContainer}>
                    <ErrorIcon size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{errors.channelName}</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Members *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.members && styles.inputError
                  ]}
                  value={members}
                  onChangeText={setMembers}
                  placeholder="Enter number of members"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {errors.members && (
                  <View style={styles.errorContainer}>
                    <ErrorIcon size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{errors.members}</Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.typeContainer}>
                  {['Batch Channel', 'Class Channel', 'Group Channel', 'Announcement Channel'].map((channelType) => (
                    <TouchableOpacity
                      key={channelType}
                      style={[
                        styles.typeOption,
                        type === channelType && styles.typeOptionSelected
                      ]}
                      onPress={() => setType(channelType)}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        type === channelType && styles.typeOptionTextSelected
                      ]}>
                        {channelType}
                      </Text>
                      {type === channelType && (
                        <CheckIcon size={16} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && (
                  <View style={styles.errorContainer}>
                    <ErrorIcon size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{errors.type}</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.cancelButton, isSubmitting && styles.disabledButton]}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Create Channel</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ChannelList({ 
  channels, 
  searchQuery, 
  activeChannel, 
  setActiveChannel, 
  onSettingsPress, 
  onViewPress, 
  onDeletePress 
}) {
  const filteredChannels = channels.filter(channel => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase().replace(/\s/g, '');
    const channelName = channel.name.toLowerCase().replace(/\s/g, '');
    const channelType = channel.type.toLowerCase().replace(/\s/g, '');
    
    return channelName.includes(searchTerm) || 
           channelType.includes(searchTerm) ||
           channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           channel.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChannelPress = (channelId) => {
    setActiveChannel(channelId === activeChannel ? null : channelId);
  };

  // Sort channels in descending batch order
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    const extractNumber = (name) => parseInt(name.replace(/\D/g, '')) || 0;
    return extractNumber(b.name) - extractNumber(a.name);
  });

  return (
    <View style={styles.channelListContainer}>
      <View style={styles.channelList}>
        <TableHeader />
        {sortedChannels.length > 0 ? (
          sortedChannels.map((channel, index) => (
            <ChannelRow 
              key={`${channel.id}-${index}`} 
              channel={channel}
              isActive={activeChannel === channel.id}
              onPress={handleChannelPress}
              onSettingsPress={onSettingsPress}
              onViewPress={onViewPress}
              onDeletePress={onDeletePress}
            />
          ))
        ) : channels.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No channels created yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Use the + button above to create a new channel
            </Text>
          </View>
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
      
      {searchQuery.length > 0 && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchInfoText}>
            Showing {sortedChannels.length} result{sortedChannels.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );
}

function ChannelsMainScreen({ onSettingsPress, onViewPress }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [channels, setChannels] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const [alertType, setAlertType] = useState('create');

  // Load channels from AsyncStorage on component mount
  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const storedChannels = await AsyncStorage.getItem(STORAGE_KEYS.CHANNELS_DATA);
      if (storedChannels) {
        setChannels(JSON.parse(storedChannels));
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  const saveChannels = async (updatedChannels) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHANNELS_DATA, JSON.stringify(updatedChannels));
    } catch (error) {
      console.error('Error saving channels:', error);
    }
  };

  const handleAddPress = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setModalVisible(true);
    setIsLoading(false);
  };

  const handleCreateChannel = async (newChannel) => {
    // Check for duplicate channel names (case insensitive)
    const isDuplicate = channels.some(
      channel => channel.name.toLowerCase() === newChannel.name.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert(
        'Duplicate Channel',
        `A channel with name "${newChannel.name}" already exists. Please use a different name.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Add new channel at the beginning of the array and save to AsyncStorage
    const updatedChannels = [newChannel, ...channels];
    setChannels(updatedChannels);
    await saveChannels(updatedChannels);
    
    setAlertType('create');
    setShowSuccessAlert(true);
  };

  const handleDeleteChannel = (channel) => {
    setChannelToDelete(channel);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!channelToDelete) return;

    try {
      // Remove channel from state and AsyncStorage
      const updatedChannels = channels.filter(c => c.id !== channelToDelete.id);
      setChannels(updatedChannels);
      await saveChannels(updatedChannels);
      
      setShowDeleteAlert(false);
      setAlertType('delete');
      setShowSuccessAlert(true);
      setChannelToDelete(null);
    } catch (error) {
      console.error('Error deleting channel:', error);
      Alert.alert('Error', 'Failed to delete channel');
    }
  };

  const handleCloseDeleteAlert = () => {
    setShowDeleteAlert(false);
    setChannelToDelete(null);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appContainer}>
        <Header 
          onAddPress={handleAddPress} 
          isLoading={isLoading} 
        />
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
            channels={channels}
            searchQuery={searchQuery}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            onSettingsPress={onSettingsPress}
            onViewPress={onViewPress}
            onDeletePress={handleDeleteChannel}
          />
        </ScrollView>
        
        <CreateChannelModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreateChannel={handleCreateChannel}
        />

        <SuccessAlert 
          visible={showSuccessAlert}
          onClose={handleCloseSuccessAlert}
          type={alertType}
        />

        <DeleteAlert
          visible={showDeleteAlert}
          onClose={handleCloseDeleteAlert}
          onConfirm={handleConfirmDelete}
          channelName={channelToDelete?.name}
        />
      </View>
    </SafeAreaView>
  );
}

export default function ChannelsScreen() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleSettingsPress = (channel) => {
    setSelectedChannel(channel);
    setCurrentScreen('settings');
  };

  const handleViewPress = (channel) => {
    setSelectedChannel(channel);
    setCurrentScreen('details');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setSelectedChannel(null);
  };

  // Import your components here
  const SettingChannel = require('./SettingChannel').default;
  const DetailsChannel = require('./DetailsChannel').default;

  if (currentScreen === 'settings') {
    return (
      <SettingChannel 
        channel={selectedChannel}
        onBackPress={handleBackToMain}
      />
    );
  }

  if (currentScreen === 'details') {
    return (
      <DetailsChannel 
        channel={selectedChannel}
        onBackPress={handleBackToMain}
      />
    );
  }

  return (
    <ChannelsMainScreen 
      onSettingsPress={handleSettingsPress}
      onViewPress={handleViewPress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
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
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    backgroundColor: '#0468CE',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    color: '#ffffff',
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
  columnChannelName: {
    flex: 2,
    textAlign: 'left',
  },
  columnMembers: {
    flex: 1,
    textAlign: 'center',
    marginRight: 15,
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
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonWrapper: {
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  emptyStateContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  typeOptionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Success Alert Styles
  successAlertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successAlertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 280,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  successCheck: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  successProgressFill: {
    height: '100%',
    borderRadius: 2, 
    width: '100%',
    transformOrigin: 'left center',
  },
  // Delete Alert Styles
  deleteAlertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  deleteAlertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 280,
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  deleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  cancelDeleteButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  confirmDeleteButton: {
    backgroundColor: '#DC2626',
  },
  cancelDeleteText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});