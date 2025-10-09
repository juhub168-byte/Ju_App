import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for permissions
const PERMISSIONS_STORAGE_KEY = 'channel_permissions';

export default function SettingChannel({ channel, onBackPress, navigation }) {
  const [permissions, setPermissions] = useState({
    'Create Posts': false,
    'Comment on Posts': false,
    'Edit Posts': false,
    'Delete Posts': false,
    'Pin Posts': false,
    'Manage Members': false,
    'No Permissions': false // New option
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load permissions when component mounts
  useEffect(() => {
    loadPermissions();
  }, [channel]);

  const loadPermissions = async () => {
    try {
      if (channel && channel.name) {
        const storedPermissions = await AsyncStorage.getItem(`${PERMISSIONS_STORAGE_KEY}_${channel.name}`);
        if (storedPermissions) {
          setPermissions(JSON.parse(storedPermissions));
        } else {
          // Initialize with default values - No Permissions selected by default
          setPermissions({
            'Create Posts': false,
            'Comment on Posts': false,
            'Edit Posts': false,
            'Delete Posts': false,
            'Pin Posts': false,
            'Manage Members': false,
            'No Permissions': true // Default to no permissions
          });
        }
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const savePermissions = async () => {
    try {
      setIsLoading(true);
      if (channel && channel.name) {
        await AsyncStorage.setItem(`${PERMISSIONS_STORAGE_KEY}_${channel.name}`, JSON.stringify(permissions));
        
        // Show success alert
        setShowSuccessAlert(true);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (permissionType) => {
    if (permissionType === 'No Permissions') {
      // When "No Permissions" is selected, uncheck all other permissions
      setPermissions({
        'Create Posts': false,
        'Comment on Posts': false,
        'Edit Posts': false,
        'Delete Posts': false,
        'Pin Posts': false,
        'Manage Members': false,
        'No Permissions': true
      });
    } else {
      // When any other permission is selected, uncheck "No Permissions"
      const newPermissions = {
        ...permissions,
        [permissionType]: !permissions[permissionType],
        'No Permissions': false
      };
      
      // If all permissions become false, automatically check "No Permissions"
      const hasAnyPermission = Object.keys(newPermissions)
        .filter(key => key !== 'No Permissions')
        .some(key => newPermissions[key] === true);
      
      if (!hasAnyPermission) {
        newPermissions['No Permissions'] = true;
      }
      
      setPermissions(newPermissions);
    }
  };

  const handleBackButtonPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const permissionTypes = [
    'Create Posts',
    'Comment on Posts',
    'Edit Posts',
    'Delete Posts',
    'Pin Posts',
    'Manage Members',
    'No Permissions' // Added as the last option
  ];

  // Get batch name from channel name (e.g., "Batch 15" from "Batch 15 Channel")
  const getBatchName = () => {
    if (channel && channel.name) {
      return channel.name.replace(' Channel', '');
    }
    return 'Current Batch';
  };

  // Count how many regular permissions are enabled (excluding "No Permissions")
  const getEnabledPermissionsCount = () => {
    const regularPermissions = Object.keys(permissions).filter(key => key !== 'No Permissions');
    return regularPermissions.filter(key => permissions[key] === true).length;
  };

  // Check if "No Permissions" is selected
  const isNoPermissionsSelected = () => {
    return permissions['No Permissions'];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        
        {/* Updated Header - Exactly like DetailsChannel */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleBackButtonPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={25} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.settingTitle}>Setting For Faculty</Text>
            </View>
          </View>
          {channel && (
            <Text style={styles.channelSubtitle}>Channel: {channel.name}</Text>
          )}
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Settings Card */}
          <View style={styles.settingsCard}>
            <Text style={styles.postingPermissions}>Posting Permissions</Text>
            
            <Text style={styles.controlText}>
              Control who can create new posts within this channel
            </Text>

            {/* Permissions Status */}
            <View style={[
              styles.permissionsStatus,
              isNoPermissionsSelected() ? styles.noPermissionsStatus : styles.hasPermissionsStatus
            ]}>
              <Text style={styles.permissionsStatusText}>
                {isNoPermissionsSelected() 
                  ? "❌ No permissions granted" 
                  : `✅ ${getEnabledPermissionsCount()} permission${getEnabledPermissionsCount() !== 1 ? 's' : ''} enabled`
                }
              </Text>
              <Text style={styles.permissionsStatusSubtext}>
                {isNoPermissionsSelected() 
                  ? "Members cannot perform any actions in this channel"
                  : "Members can perform the selected actions"
                }
              </Text>
            </View>

            {/* Permissions Section */}
            <View style={styles.permissionTypesSection}>
              <Text style={styles.permissionTypesTitle}>
                Permissions for {getBatchName()} Members:
              </Text>
              
              {/* Regular Permissions */}
              {permissionTypes.filter(type => type !== 'No Permissions').map((permissionType, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.permissionItem}
                  onPress={() => togglePermission(permissionType)}
                >
                  <View style={[
                    styles.checkbox,
                    permissions[permissionType] && styles.checkedBox,
                    isNoPermissionsSelected() && styles.disabledCheckbox
                  ]}>
                    {permissions[permissionType] && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={[
                    styles.permissionText,
                    isNoPermissionsSelected() && styles.disabledPermissionText
                  ]}>
                    {permissionType}
                  </Text>
                </TouchableOpacity>
              ))}
              
              {/* Separator */}
              <View style={styles.separator} />
              
              {/* No Permissions Option */}
              <TouchableOpacity 
                style={styles.noPermissionsItem}
                onPress={() => togglePermission('No Permissions')}
              >
                <View style={[
                  styles.checkbox,
                  styles.noPermissionsCheckbox,
                  isNoPermissionsSelected() && styles.noPermissionsCheckedBox
                ]}>
                  {isNoPermissionsSelected() && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[
                  styles.noPermissionsText,
                  isNoPermissionsSelected() && styles.noPermissionsCheckedText
                ]}>
                  No Permissions
                </Text>
              </TouchableOpacity>
              
              {/* Explanation Text */}
              {isNoPermissionsSelected() && (
                <Text style={styles.noPermissionsExplanation}>
                  When "No Permissions" is selected, members cannot create posts, comment, edit, delete, pin posts, or manage members in this channel.
                </Text>
              )}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={savePermissions}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.saveText}>Saving...</Text>
            ) : (
              <>
                <Text style={styles.saveText}>
                  {isNoPermissionsSelected() ? 'Save No Permissions' : 'Save Settings'}
                </Text>
                <View style={styles.saveIcon}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Success Alert Modal */}
        <Modal
          visible={showSuccessAlert}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessAlert(false)}
        >
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#0C8806" />
              </View>
              <Text style={styles.alertTitle}>
                {isNoPermissionsSelected() ? 'No Permissions Set!' : 'Settings Saved!'}
              </Text>
              <Text style={styles.alertMessage}>
                {isNoPermissionsSelected() 
                  ? `Members of ${getBatchName()} have no permissions in this channel.`
                  : `Permissions for ${getBatchName()} have been updated successfully.`
                }
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, styles.successProgressFill]} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // Updated Header Styles to match DetailsChannel
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40, // Position text closer to the arrow like DetailsChannel
  },
  settingTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#67696f',
    textAlign: 'center',
  },
  channelSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#0468ce',
    textAlign: 'center',
    marginTop: 8,
  },
  settingsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postingPermissions: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#25282d',
    marginBottom: 16,
  },
  controlText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#797e89',
    lineHeight: 22,
    marginBottom: 20,
  },
  permissionsStatus: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  hasPermissionsStatus: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0468ce',
  },
  noPermissionsStatus: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  permissionsStatusText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  permissionsStatusSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  permissionTypesSection: {
    marginBottom: 24,
  },
  permissionTypesTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#25282d',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9ca3af',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#0468ce',
    borderColor: '#0468ce',
  },
  disabledCheckbox: {
    opacity: 0.5,
  },
  permissionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#25282d',
  },
  disabledPermissionText: {
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
    marginLeft: 8,
  },
  noPermissionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 8,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  noPermissionsCheckbox: {
    borderColor: '#DC2626',
  },
  noPermissionsCheckedBox: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  noPermissionsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#DC2626',
  },
  noPermissionsCheckedText: {
    color: '#DC2626',
  },
  noPermissionsExplanation: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 32,
    lineHeight: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0468ce',
    marginHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  saveIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: '#0C8806',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    width: '100%',
  },
  successProgressFill: {
    backgroundColor: '#0C8806',
  },
});