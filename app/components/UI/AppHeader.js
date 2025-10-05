// components/ui/AppHeader.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * AppHeader
 * Props:
 * - logo: string (default 'JU HUB')
 * - title?: string (if provided, replaces logo)
 * - onBack?: () => void
 * - onNotificationsPress?: () => void
 * - onProfilePress?: () => void
 * - RightComponent?: React.ComponentType (optional custom right-side)
 * - showBorder?: boolean (default true)
 * - style?: ViewStyle (container override)
 */
export default function AppHeader({
  logo = 'JU HUB',
  title,
  onBack,
  onNotificationsPress,
  onProfilePress,
  RightComponent,
  showBorder = true,
  style,
}) {
  return (
    <SafeAreaView style={[styles.safe, showBorder && styles.border, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack ? (
            <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
          ) : null}
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <Text style={styles.logo}>{logo}</Text>
          )}
        </View>

        <View style={styles.headerRight}>
          {RightComponent ? (
            <RightComponent />
          ) : (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationsPress}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={24} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onProfilePress}
                activeOpacity={0.7}
              >
                <Ionicons name="person-circle-outline" size={24} color="#374151" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#FFFFFF',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 14 : 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
