import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnnouncementsScreen from './AnnouncementsScreen';
import ChannelsScreen from './ChannelsScreen';
import ClubsScreen from './ClubsScreen';
import HomeScreen from './HomeScreen';

// Define the tab structure
/**
 * @typedef {Object} Tab
 * @property {string} name
 * @property {string} icon
 * @property {React.ReactNode} component
 */

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Home', icon: 'home', component: <HomeScreen /> },
    // { name: 'Channels', icon: 'albums', component: <ChannelsScreen /> },
    { name: 'Channel', icon: 'chatbubbles', component: <ChannelsScreen /> },
    { name: 'Clubs', icon: 'person', component: <ClubsScreen /> },
    { name: 'Announcements', icon: 'megaphone', component: <AnnouncementsScreen /> },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Main Content */}
      <View style={styles.content}>
        {tabs[activeTab].component}
      </View>
      
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabItem,
              activeTab === index && styles.activeTabItem
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={activeTab === index ? '#181be6ff' : '#4e5257ff'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText
              ]}
            >
              {tab.name}
            </Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  screenText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabBar: {
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  borderTopWidth: 2,
  borderTopColor: '#3b82f6', // deep blue border
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingVertical: 10,
  marginBottom: 3,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: 5 },
  shadowRadius: 12,
  elevation: 12,
  overflow: 'hidden',
},

tabItem: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
},

activeTabItem: {
  // backgroundColor: '#dbeafe', // subtle gradient-like blue
  marginHorizontal: 6,
  marginBottom: 5,
  paddingVertical: 16,
  borderRadius: 15,
  shadowColor: '#3b82f6',
  shadowOpacity: 17.30,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 8,
  elevation: 8,
},

tabText: {
  fontSize: 12,
  marginTop: 4,
  color: '#4e5257ff', // light gray
  fontWeight: '500',
},

activeTabText: {
  color: '#1e40af', // deep active blue
  fontWeight: '600',
},

activeIndicator: {
  position: 'absolute',
  bottom: 0,
  width: '25%',
  height: 4,
  backgroundColor: '#0928f3ff',
  borderRadius: 4,
  alignSelf: 'center',
  shadowColor: '#3b82f6',
  shadowOpacity: 0.4,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 4,
},

});
