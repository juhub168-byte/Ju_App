import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Switch,
  Alert,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const ANNOUNCEMENT_KEY = "announcements_list";

const saveAnnouncements = async (data) => {
  try {
    await AsyncStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(data));
  } catch (e) {
    console.log("Error saving announcements:", e);
  }
};

const loadAnnouncements = async () => {
  try {
    const json = await AsyncStorage.getItem(ANNOUNCEMENT_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.log("Error loading announcements:", e);
    return null;
  }
};

export default function AnnouncementsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Dropdown states for create modal
  const [facultyDropdownVisible, setFacultyDropdownVisible] = useState(false);
  const [departmentDropdownVisible, setDepartmentDropdownVisible] = useState(false);
  const [batchDropdownVisible, setBatchDropdownVisible] = useState(false);

  // Dropdown states for edit modal
  const [editFacultyDropdownVisible, setEditFacultyDropdownVisible] = useState(false);
  const [editDepartmentDropdownVisible, setEditDepartmentDropdownVisible] = useState(false);
  const [editBatchDropdownVisible, setEditBatchDropdownVisible] = useState(false);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Guest Lecture: Innovation in Technology",
      content: "Join us for an inspiring guest lecture by industry leader Dr. Amanda Foster on the latest innovations in technology and their impact on society...",
      author: "Faculty Dean",
      time: "3 days ago",
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-30/ss2PYi1B0O.png",
      priority: false,
      faculty: "Computer Science",
      department: "Computer Science",
      batch: "Batch 14"
    },
    {
      id: 2,
      title: "Important: Midterm Exam Schedule Update",
      content: "The midterm examination schedule has been revised due to recent changes. All students are required to check their updated exam dates and venues",
      author: "Faculty Dean",
      time: "2 hours ago",
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-30/kS9XrAWqoZ.png",
      priority: true,
      faculty: "Engineering",
      department: "Electrical Engineering",
      batch: "Batch 13"
    },
    {
      id: 3,
      title: "New Research Opportunities Available",
      content: "Exciting research positions are now open for undergraduate students interested in AI and Machine Learning projects. Applications are due by all",
      author: "Faculty Dean",
      time: "5 hours ago",
      priority: false,
      faculty: "Computer Science",
      department: "Software Engineering",
      batch: "Batch 15"
    },
    {
      id: 4,
      title: "Campus Safety Guidelines Update",
      content: "New safety protocols have been implemented across all campus facilities. Please review the updated guidelines to ensure everyone's wellbeing...",
      author: "Faculty Dean",
      time: "1 day ago",
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-30/cGOO0o1caT.png",
      priority: false,
      faculty: "Business",
      department: "Business Administration",
      batch: "Batch 12"
    },
    {
      id: 5,
      title: "Library Extended Hours During Finals",
      content: "The university library will be extending its operating hours during the final examination period to support student study needs. New hours are...",
      author: "Faculty Dean",
      time: "2 days ago",
      priority: false,
      faculty: "Arts",
      department: "English Literature",
      batch: "Batch 16"
    }
  ]);

  // Profile images
  const profileImages = {
    facultyDean: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-30/ss2PYi1B0O.png",
    user: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-30/kS9XrAWqoZ.png"
  };

  // Data for dropdowns
  const faculties = ["Computer Science", "Engineering", "Business", "Medicine", "Arts"];
  const departments = {
    "Computer Science": ["Computer Science", "Information Technology", "Software Engineering"],
    "Engineering": ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
    "Business": ["Business Administration", "Finance", "Marketing"],
    "Medicine": ["General Medicine", "Dentistry", "Pharmacy"],
    "Arts": ["English Literature", "History", "Psychology"]
  };
  const batches = ["Batch 12", "Batch 13", "Batch 14", "Batch 15", "Batch 16"];

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    priority: false,
    faculty: '',
    department: '',
    batch: '',
    image: null,
  });

  const [editAnnouncement, setEditAnnouncement] = useState({
    title: '',
    description: '',
    priority: false,
    faculty: '',
    department: '',
    batch: '',
    image: null,
  });

  useEffect(() => {
    (async () => {
      const localData = await loadAnnouncements();
      if (localData) setAnnouncements(localData);
    })();
  }, []);

  useEffect(() => {
    saveAnnouncements(announcements);
  }, [announcements]);

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImagePick = async (setAnnouncement, announcement) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAnnouncement({ ...announcement, image: result.assets[0].uri });
    }
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newAnn = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.description,
      author: "Faculty Dean",
      time: "Just now",
      priority: newAnnouncement.priority,
      image: newAnnouncement.image,
      faculty: newAnnouncement.faculty,
      department: newAnnouncement.department,
      batch: newAnnouncement.batch
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewAnnouncement({
      title: '',
      description: '',
      priority: false,
      faculty: '',
      department: '',
      batch: '',
      image: null
    });
    setCreateModalVisible(false);
    Alert.alert('Success', 'Announcement published successfully!');
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditAnnouncement({
      title: announcement.title,
      description: announcement.content,
      priority: announcement.priority,
      faculty: announcement.faculty || 'Computer Science',
      department: announcement.department || 'Computer Science',
      batch: announcement.batch || 'Batch 14',
      image: announcement.image || null
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editAnnouncement.title || !editAnnouncement.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setAnnouncements(announcements.map(item =>
      item.id === selectedAnnouncement.id
        ? {
            ...item,
            title: editAnnouncement.title,
            content: editAnnouncement.description,
            priority: editAnnouncement.priority,
            image: editAnnouncement.image,
            faculty: editAnnouncement.faculty,
            department: editAnnouncement.department,
            batch: editAnnouncement.batch
          }
        : item
    ));

    setEditModalVisible(false);
    setSelectedAnnouncement(null);
    Alert.alert('Success', 'Announcement updated successfully!');
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setAnnouncements(announcements.filter(item => item.id !== selectedAnnouncement.id));
    setDeleteModalVisible(false);
    setSelectedAnnouncement(null);
    Alert.alert('Success', 'Announcement deleted successfully!');
  };

  const handleCancelCreate = () => {
    setCreateModalVisible(false);
    setNewAnnouncement({
      title: '',
      description: '',
      priority: false,
      faculty: '',
      department: '',
      batch: '',
      image: null
    });
    // Close all dropdowns
    setFacultyDropdownVisible(false);
    setDepartmentDropdownVisible(false);
    setBatchDropdownVisible(false);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditAnnouncement({
      title: '',
      description: '',
      priority: false,
      faculty: '',
      department: '',
      batch: '',
      image: null
    });
    setSelectedAnnouncement(null);
    // Close all dropdowns
    setEditFacultyDropdownVisible(false);
    setEditDepartmentDropdownVisible(false);
    setEditBatchDropdownVisible(false);
  };

  // Dropdown handlers for create modal
  const handleFacultySelect = (faculty) => {
    setNewAnnouncement({
      ...newAnnouncement,
      faculty: faculty,
      department: '', // Reset department when faculty changes
      batch: '' // Reset batch when faculty changes
    });
    setFacultyDropdownVisible(false);
  };

  const handleDepartmentSelect = (department) => {
    setNewAnnouncement({
      ...newAnnouncement,
      department: department
    });
    setDepartmentDropdownVisible(false);
  };

  const handleBatchSelect = (batch) => {
    setNewAnnouncement({
      ...newAnnouncement,
      batch: batch
    });
    setBatchDropdownVisible(false);
  };

  // Dropdown handlers for edit modal
  const handleEditFacultySelect = (faculty) => {
    setEditAnnouncement({
      ...editAnnouncement,
      faculty: faculty,
      department: '', // Reset department when faculty changes
    });
    setEditFacultyDropdownVisible(false);
  };

  const handleEditDepartmentSelect = (department) => {
    setEditAnnouncement({
      ...editAnnouncement,
      department: department
    });
    setEditDepartmentDropdownVisible(false);
  };

  const handleEditBatchSelect = (batch) => {
    setEditAnnouncement({
      ...editAnnouncement,
      batch: batch
    });
    setEditBatchDropdownVisible(false);
  };

  const renderAnnouncementCard = (item) => (
    <View key={item.id} style={[styles.announcementCard, item.priority && styles.priorityCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <Image 
              source={{ uri: profileImages.facultyDean }} 
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <MaterialCommunityIcons name="square-edit-outline" size={22} color="#235FE3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
            <MaterialCommunityIcons name="trash-can" size={22} color="#FE5C5F" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementContent}>{item.content}</Text>

      {item.image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.announcementImage} />
        </View>
      )}

      {/* Target Audience Info */}
      {/* <View style={styles.audienceInfo}>
        <Text style={styles.audienceText}>
          {item.faculty} → {item.department} → {item.batch}
        </Text>
      </View> */}

      {item.priority && (
        <View style={styles.priorityBadge}>
          <Text style={styles.priorityText}>High Priority</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCreateModalVisible(true)} style={styles.createButton}>
          <Icon name="add" size={25} color="#ffffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Image 
              source={{ uri: profileImages.user }} 
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements..."
            placeholderTextColor="#adaebc"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Announcements List */}
      <ScrollView style={styles.announcementsList} showsVerticalScrollIndicator={false}>
        {filteredAnnouncements.map(renderAnnouncementCard)}
      </ScrollView>

      {/* Create Announcement Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelCreate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Announcement</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancelCreate}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter announcement title..."
                  placeholderTextColor="#adaebc"
                  value={newAnnouncement.title}
                  onChangeText={(text) => setNewAnnouncement({...newAnnouncement, title: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write your announcement details..."
                  placeholderTextColor="#adaebc"
                  multiline
                  numberOfLines={4}
                  value={newAnnouncement.description}
                  onChangeText={(text) => setNewAnnouncement({...newAnnouncement, description: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Image (Optional)</Text>
                <TouchableOpacity
                  style={styles.imageUpload}
                  onPress={() => handleImagePick(setNewAnnouncement, newAnnouncement)}
                >
                  {newAnnouncement.image ? (
                    <Image source={{ uri: newAnnouncement.image }} style={{ width: 120, height: 120, borderRadius: 10 }} />
                  ) : (
                    <>
                      <Icon name="cloud-upload" size={32} color="#6b7280" />
                      <Text style={styles.uploadText}>Tap to upload image</Text>
                      <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Target Audience Section with Dropdowns */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Audience</Text>
                
                {/* Faculty Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={styles.selectInput}
                    onPress={() => setFacultyDropdownVisible(!facultyDropdownVisible)}
                  >
                    <Text style={newAnnouncement.faculty ? styles.selectText : styles.placeholderText}>
                      {newAnnouncement.faculty || "Select Faculty"}
                    </Text>
                    <Icon 
                      name={facultyDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {facultyDropdownVisible && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {faculties.map((faculty, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleFacultySelect(faculty)}
                          >
                            <Text style={styles.dropdownItemText}>{faculty}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Department Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={[styles.selectInput, !newAnnouncement.faculty && styles.disabledInput]}
                    onPress={() => newAnnouncement.faculty && setDepartmentDropdownVisible(!departmentDropdownVisible)}
                    disabled={!newAnnouncement.faculty}
                  >
                    <Text style={newAnnouncement.department ? styles.selectText : styles.placeholderText}>
                      {newAnnouncement.department || "Select Department"}
                    </Text>
                    <Icon 
                      name={departmentDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {departmentDropdownVisible && newAnnouncement.faculty && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {departments[newAnnouncement.faculty]?.map((department, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleDepartmentSelect(department)}
                          >
                            <Text style={styles.dropdownItemText}>{department}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Batch Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={styles.selectInput}
                    onPress={() => setBatchDropdownVisible(!batchDropdownVisible)}
                  >
                    <Text style={newAnnouncement.batch ? styles.selectText : styles.placeholderText}>
                      {newAnnouncement.batch || "Select Batch"}
                    </Text>
                    <Icon 
                      name={batchDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {batchDropdownVisible && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {batches.map((batch, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleBatchSelect(batch)}
                          >
                            <Text style={styles.dropdownItemText}>{batch}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.priorityToggle}>
                <View style={styles.toggleLabel}>
                  <Text style={styles.inputLabel}>High Priority</Text>
                  <Text style={styles.toggleSubtext}>Mark as urgent announcement</Text>
                </View>
                <Switch
                  value={newAnnouncement.priority}
                  onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
                  trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
                  thumbColor={newAnnouncement.priority ? '#ffffff' : '#ffffff'}
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.publishButton}
                onPress={handleCreateAnnouncement}
              >
                <Text style={styles.publishButtonText}>Publish Announcement</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelCreate}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Announcement</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancelEdit}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter announcement title..."
                  placeholderTextColor="#adaebc"
                  value={editAnnouncement.title}
                  onChangeText={(text) => setEditAnnouncement({...editAnnouncement, title: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write your announcement details..."
                  placeholderTextColor="#adaebc"
                  multiline
                  numberOfLines={4}
                  value={editAnnouncement.description}
                  onChangeText={(text) => setEditAnnouncement({...editAnnouncement, description: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Image</Text>
                <TouchableOpacity
                  style={styles.imageUpload}
                  onPress={() => handleImagePick(setEditAnnouncement, editAnnouncement)}
                >
                  {editAnnouncement.image ? (
                    <Image source={{ uri: editAnnouncement.image }} style={{ width: 120, height: 120, borderRadius: 10 }} />
                  ) : (
                    <>
                      <Icon name="cloud-upload" size={32} color="#6b7280" />
                      <Text style={styles.uploadText}>Change Image</Text>
                      <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Target Audience Section with Dropdowns for Edit Modal */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Audience</Text>
                
                {/* Faculty Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={styles.selectInput}
                    onPress={() => setEditFacultyDropdownVisible(!editFacultyDropdownVisible)}
                  >
                    <Text style={editAnnouncement.faculty ? styles.selectText : styles.placeholderText}>
                      {editAnnouncement.faculty || "Select Faculty"}
                    </Text>
                    <Icon 
                      name={editFacultyDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {editFacultyDropdownVisible && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {faculties.map((faculty, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleEditFacultySelect(faculty)}
                          >
                            <Text style={styles.dropdownItemText}>{faculty}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Department Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={[styles.selectInput, !editAnnouncement.faculty && styles.disabledInput]}
                    onPress={() => editAnnouncement.faculty && setEditDepartmentDropdownVisible(!editDepartmentDropdownVisible)}
                    disabled={!editAnnouncement.faculty}
                  >
                    <Text style={editAnnouncement.department ? styles.selectText : styles.placeholderText}>
                      {editAnnouncement.department || "Select Department"}
                    </Text>
                    <Icon 
                      name={editDepartmentDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {editDepartmentDropdownVisible && editAnnouncement.faculty && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {departments[editAnnouncement.faculty]?.map((department, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleEditDepartmentSelect(department)}
                          >
                            <Text style={styles.dropdownItemText}>{department}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Batch Dropdown */}
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity 
                    style={styles.selectInput}
                    onPress={() => setEditBatchDropdownVisible(!editBatchDropdownVisible)}
                  >
                    <Text style={editAnnouncement.batch ? styles.selectText : styles.placeholderText}>
                      {editAnnouncement.batch || "Select Batch"}
                    </Text>
                    <Icon 
                      name={editBatchDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {editBatchDropdownVisible && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {batches.map((batch, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleEditBatchSelect(batch)}
                          >
                            <Text style={styles.dropdownItemText}>{batch}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.priorityToggle}>
                <View style={styles.toggleLabel}>
                  <Text style={styles.inputLabel}>High Priority</Text>
                  <Text style={styles.toggleSubtext}>Mark as urgent announcement</Text>
                </View>
                <Switch
                  value={editAnnouncement.priority}
                  onValueChange={(value) => setEditAnnouncement({...editAnnouncement, priority: value})}
                  trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
                  thumbColor={editAnnouncement.priority ? '#ffffff' : '#ffffff'}
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.publishButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.publishButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <MaterialCommunityIcons name="trash-can" size={22} color="#dc2626" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Announcement</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelDeleteButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  profileText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter',
  },
  filterButton: {
    padding: 4,
  },
  announcementsList: {
    flex: 1,
    padding: 16,
  },
  announcementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#235fe3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  priorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 3,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter',
    marginBottom: 8,
    lineHeight: 24,
  },
  announcementContent: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  announcementImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  // Audience info styles
  audienceInfo: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  audienceText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter',
    fontStyle: 'italic',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    paddingBottom: 40,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    position: 'relative',
  },
  navText: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  activeNavText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 2,
    backgroundColor: '#2563eb',
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 13,
    color: '#111827',
    fontFamily: 'Inter',
  },
  textArea: {
    height: 122,
    textAlignVertical: 'top',
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Inter',
    marginTop: 8,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: 'Inter',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
  },
  disabledInput: {
    opacity: 0.7,
  },
  selectText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter',
  },
  placeholderText: {
    fontSize: 14,
    color: '#808080',
    fontFamily: 'Inter',
  },
  disabledText: {
    color: '#808080',
  },
  selectedAudience: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  selectedAudienceText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter',
  },
  priorityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  toggleLabel: {
    flex: 1,
  },
  toggleSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  publishButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  cancelButton: {
    backgroundColor: '#e7ebf1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter',
  },
  deleteModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  cancelDeleteButton: {
    flex: 1,
    backgroundColor: '#e7ebf1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelDeleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter',
  },
  // New dropdown styles
  dropdownContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 150,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter',
  },
});

