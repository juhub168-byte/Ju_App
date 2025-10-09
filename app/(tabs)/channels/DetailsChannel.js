import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Storage keys
const STORAGE_KEYS = {
  POST_DATA: 'post_data',
  USER_POSTS: 'user_posts',
  POST_LIKES: 'post_likes',
  POST_COMMENTS: 'post_comments',
};

// Delete Alert Component
function DeleteAlert({ visible, onClose, onConfirm }) {
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
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
          <Icon name="delete" size={48} color="#DC2626" />
        </View>
        <Text style={styles.deleteTitle}>Delete Post</Text>
        <Text style={styles.deleteMessage}>Are you sure you want to delete this post? This action cannot be undone.</Text>
        
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
            <Icon name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.confirmDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// Success Alert Component
function SuccessAlert({ visible, onClose, type = 'publish' }) {
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [checkScale] = useState(new Animated.Value(0));
  const [progressScale] = useState(new Animated.Value(0));

  React.useEffect(() => {
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
  const message = isDelete ? 'Your post has been deleted successfully' : 'Your post has been published successfully';
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
            <Icon name={iconName} size={36} color="#FFFFFF" />
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

// Comment Modal Component
function CommentModal({ visible, onClose, postId, postTitle }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadComments();
    }
  }, [visible, postId]);

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
      if (storedComments) {
        const allComments = JSON.parse(storedComments);
        const postComments = allComments[postId] || [];
        setComments(postComments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const saveComment = async () => {
    if (!comment.trim()) return;

    try {
      setIsLoading(true);
      const newComment = {
        id: Date.now().toString(),
        text: comment.trim(),
        author: 'You',
        timestamp: new Date().toISOString(),
        authorAvatar: '👤'
      };

      const storedComments = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
      const allComments = storedComments ? JSON.parse(storedComments) : {};
      const postComments = allComments[postId] || [];
      
      allComments[postId] = [newComment, ...postComments];
      await AsyncStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(allComments));
      
      setComments(allComments[postId]);
      setComment('');
    } catch (error) {
      console.error('Error saving comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.commentModalOverlay}
      >
        <View style={styles.commentModalContainer}>
          <View style={styles.commentModalHeader}>
            <View>
              <Text style={styles.commentModalTitle}>Comments</Text>
              <Text style={styles.commentModalSubtitle}>{postTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.commentCloseButton}>
              <Icon name="close" size={24} color="#67696f" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsList}>
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Icon name="chat-bubble-outline" size={48} color="#9ca3af" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map((commentItem) => (
                <View key={commentItem.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.avatarText}>{commentItem.authorAvatar}</Text>
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{commentItem.author}</Text>
                      <Text style={styles.commentTime}>
                        {formatTime(commentItem.timestamp)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{commentItem.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.commentSendButton,
                (!comment.trim() || isLoading) && styles.commentSendButtonDisabled
              ]}
              onPress={saveComment}
              disabled={!comment.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Icon name="send" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Post Card Component
function PostCard({ post, index, onLike, onComment, onDelete, onEdit, likesData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    // Load like status and count for this post
    const postLikes = likesData[post.id] || { count: 0, liked: false };
    setIsLiked(postLikes.liked);
    setLikeCount(postLikes.count);

    // Load comment count
    loadCommentCount();
  }, [post.id, likesData]);

  const loadCommentCount = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
      if (storedComments) {
        const allComments = JSON.parse(storedComments);
        const postComments = allComments[post.id] || [];
        setCommentCount(postComments.length);
      }
    } catch (error) {
      console.error('Error loading comment count:', error);
    }
  };

  const handleLike = () => {
    onLike(post.id, !isLiked);
  };

  const handleComment = () => {
    onComment(post.id, post.title);
  };

  const handleDelete = () => {
    onDelete(post.id, post.title);
  };

  const handleEdit = () => {
    onEdit(post);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postTitleContainer}>
          <Text style={styles.postCardTitle}>{post.title}</Text>
        </View>
        <View style={styles.postHeaderRight}>
          <Text style={styles.postCardDate}>
            {formatDate(post.publishedAt)}
          </Text>
          <View style={styles.postActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.editPostButton}>
              <Icon name="edit" size={18} color="#0468ce" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.deletePostButton}>
              <Icon name="delete-outline" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {post.hasImage && post.imageUri && (
        <Image 
          source={{ uri: post.imageUri }} 
          style={styles.postCardImage}
        />
      )}

      <Text style={styles.postCardDescription}>
        {post.body}
      </Text>

      <View style={styles.postCardActions}>
        <TouchableOpacity 
          style={styles.postActionButton}
          onPress={handleLike}
        >
          <Icon 
            name={isLiked ? "thumb-up" : "thumb-up-off-alt"} 
            size={18} 
            color={isLiked ? "#0468ce" : "#797e89"} 
          />
          <Text style={[
            styles.postActionText,
            isLiked && styles.likedActionText
          ]}>
            Like {likeCount > 0 ? `(${likeCount})` : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.postActionButton}
          onPress={handleComment}
        >
          <Icon name="comment" size={18} color="#797e89" />
          <Text style={styles.postActionText}>
            Comment {commentCount > 0 ? `(${commentCount})` : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.postActionButton}>
          <Icon name="share" size={18} color="#797e89" />
          <Text style={styles.postActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Empty State Component
function EmptyPostsState({ onAddPost }) {
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Icon name="article" size={48} color="#9ca3af" />
      </View>
      <Text style={styles.emptyStateTitle}>No posts yet</Text>
      <Text style={styles.emptyStateDescription}>
        Create your first post to share with the channel
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={onAddPost}>
        <Text style={styles.emptyStateButtonText}>Create First Post</Text>
      </TouchableOpacity>
    </View>
  );
}

// Model Post Modal Component
function ModelPostModal({ visible, onClose, onPublishSuccess, editingPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const scaleAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const isEditing = !!editingPost;

  React.useEffect(() => {
    if (visible) {
      if (isEditing) {
        // Load the post data for editing
        setTitle(editingPost.title || '');
        setBody(editingPost.body || '');
        setAllowComments(editingPost.allowComments !== false);
        setHasImage(!!editingPost.imageUri);
        setImageUri(editingPost.imageUri || null);
        
        if (editingPost.title) validateField('title', editingPost.title);
        if (editingPost.body) validateField('body', editingPost.body);
      } else {
        loadSavedData();
      }
      animateModalIn();
    } else {
      animateModalOut();
      setErrors({});
      setTouched({});
      // Reset form when modal closes
      if (!isEditing) {
        resetForm();
      }
    }
  }, [visible, editingPost]);

  const animateModalIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.trim().length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        } else if (value.trim().length > 100) {
          newErrors.title = 'Title must be less than 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'body':
        if (!value.trim()) {
          newErrors.body = 'Body content is required';
        } else if (value.trim().length < 10) {
          newErrors.body = 'Body must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          newErrors.body = 'Body must be less than 1000 characters';
        } else {
          delete newErrors.body;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Body content is required';
    } else if (body.trim().length < 10) {
      newErrors.body = 'Body must be at least 10 characters';
    } else if (body.trim().length > 1000) {
      newErrors.body = 'Body must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    setTouched({
      title: true,
      body: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return title.trim().length >= 5 && 
           title.trim().length <= 100 &&
           body.trim().length >= 10 && 
           body.trim().length <= 1000;
  };

  const loadSavedData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.POST_DATA);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTitle(parsedData.title || '');
        setBody(parsedData.body || '');
        setAllowComments(parsedData.allowComments !== false);
        setHasImage(!!parsedData.imageUri);
        setImageUri(parsedData.imageUri || null);
        
        if (parsedData.title) validateField('title', parsedData.title);
        if (parsedData.body) validateField('body', parsedData.body);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.POST_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.POST_DATA);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const saveUserPost = async (postData) => {
    try {
      const existingPosts = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      
      if (isEditing) {
        // Update existing post
        const updatedPosts = posts.map(post => 
          post.id === editingPost.id ? postData : post
        );
        await AsyncStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(updatedPosts));
        return updatedPosts;
      } else {
        // Add new post to the beginning of the array (most recent first)
        posts.unshift(postData);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(posts));
        return posts;
      }
    } catch (error) {
      console.error('Error saving user post:', error);
      throw error;
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Cannot Publish', 
        'Please fill in all required fields:\n• Title (5-100 characters)\n• Body (10-1000 characters)'
      );
      return;
    }

    if (!isFormValid()) {
      Alert.alert(
        'Cannot Publish', 
        'Please make sure all fields meet the requirements:\n• Title: 5-100 characters\n• Body: 10-1000 characters'
      );
      return;
    }

    setIsPublishing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const postData = {
        id: isEditing ? editingPost.id : Date.now().toString(),
        title: title.trim(),
        body: body.trim(),
        allowComments,
        hasImage,
        imageUri,
        publishedAt: isEditing ? editingPost.publishedAt : new Date().toISOString(),
      };
      
      console.log(isEditing ? 'Updating:' : 'Publishing:', postData);
      
      await saveUserPost(postData);
      
      if (!isEditing) {
        await clearData();
      }
      
      resetForm();
      setIsPublishing(false);
      onClose();
      onPublishSuccess(postData, isEditing);
    } catch (error) {
      console.error('Error publishing post:', error);
      Alert.alert('Error', 'Failed to publish post. Please try again.');
      setIsPublishing(false);
    }
  };

  const handleCancel = async () => {
    setIsCanceling(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!isEditing) {
      await clearData();
    }
    
    resetForm();
    
    setIsCanceling(false);
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setAllowComments(true);
    setHasImage(false);
    setImageUri(null);
    setErrors({});
    setTouched({});
  };

  const handleInputChange = async (field, value) => {
    if (field === 'title') setTitle(value);
    if (field === 'body') setBody(value);
    
    if (touched[field]) {
      validateField(field, value);
    }
    
    if (!isEditing) {
      setTimeout(async () => {
        const currentData = {
          title: field === 'title' ? value : title,
          body: field === 'body' ? value : body,
          allowComments,
          hasImage,
          imageUri,
        };
        await saveData(currentData);
      }, 500);
    }
  };

  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'title' ? title : body);
  };

  const handleCommentsToggle = async () => {
    const newValue = !allowComments;
    setAllowComments(newValue);
    
    if (!isEditing) {
      const currentData = {
        title,
        body,
        allowComments: newValue,
        hasImage,
        imageUri,
      };
      await saveData(currentData);
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'Sorry, we need camera roll permissions to let you choose photos from your phone.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);
        setHasImage(true);
        
        if (!isEditing) {
          const currentData = {
            title,
            body,
            allowComments,
            hasImage: true,
            imageUri: selectedImage.uri,
          };
          await saveData(currentData);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = async () => {
    setImageUri(null);
    setHasImage(false);
    
    if (!isEditing) {
      const currentData = {
        title,
        body,
        allowComments,
        hasImage: false,
        imageUri: null,
      };
      await saveData(currentData);
    }
  };

  const modalStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: fadeAnim,
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Icon name="close" size={24} color="#67696f" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading your draft...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.postContent}>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Title *</Text>
                      {errors.title && (
                        <View style={styles.errorContainer}>
                          <Icon name="error-outline" size={16} color="#DC2626" />
                          <Text style={styles.errorText}>{errors.title}</Text>
                        </View>
                      )}
                    </View>
                    <View style={[
                      styles.inputContainer,
                      errors.title && styles.inputError
                    ]}>
                      <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={(value) => handleInputChange('title', value)}
                        onBlur={() => handleInputBlur('title')}
                        placeholder="Engaging Title Your Post"
                        placeholderTextColor="#9ca3af"
                        maxLength={100}
                      />
                    </View>
                    <Text style={styles.charCount}>
                      {title.length}/100 characters
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Body *</Text>
                      {errors.body && (
                        <View style={styles.errorContainer}>
                          <Icon name="error-outline" size={16} color="#DC2626" />
                          <Text style={styles.errorText}>{errors.body}</Text>
                        </View>
                      )}
                    </View>
                    <View style={[
                      styles.inputContainer,
                      errors.body && styles.inputError
                    ]}>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={body}
                        onChangeText={(value) => handleInputChange('body', value)}
                        onBlur={() => handleInputBlur('body')}
                        placeholder="Share Your thoughts or details....."
                        placeholderTextColor="#9ca3af"
                        multiline
                        textAlignVertical="top"
                        maxLength={1000}
                      />
                    </View>
                    <Text style={styles.charCount}>
                      {body.length}/1000 characters
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Image (Optional)</Text>
                    <TouchableOpacity 
                      style={styles.imageUpload} 
                      onPress={handleImageUpload}
                      disabled={isPublishing || isCanceling}
                    >
                      {hasImage && imageUri ? (
                        <View style={styles.imagePreview}>
                          <Image 
                            source={{ uri: imageUri }} 
                            style={styles.previewImage}
                            resizeMode="cover"
                          />
                          <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={removeImage}
                            disabled={isPublishing || isCanceling}
                          >
                            <Icon name="close" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                          <View style={styles.imageOverlay}>
                            <Text style={styles.imageUploadText}>Tap to change image</Text>
                          </View>
                        </View>
                      ) : (
                        <>
                          <View style={styles.uploadIconContainer}>
                            <Icon name="image" size={32} color="#0C8806" />
                          </View>
                          <Text style={styles.imageUploadText}>
                            Upload Your image Here
                          </Text>
                          <View style={styles.uploadButton}>
                            <Icon name="file-upload" size={20} color="#FFFFFF" />
                          </View>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.commentsSection}>
                    <TouchableOpacity 
                      style={[
                        styles.checkbox,
                        allowComments && styles.checkedCheckbox,
                        (isPublishing || isCanceling) && styles.disabledCheckbox
                      ]}
                      onPress={handleCommentsToggle}
                      disabled={isPublishing || isCanceling}
                    >
                      {allowComments && <Icon name="check" size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                    <Text style={styles.commentsLabel}>Allow Comments</Text>
                  </View>

                  {Object.keys(errors).length > 0 && touched.title && touched.body && (
                    <View style={styles.validationSummary}>
                      <Icon name="error-outline" size={20} color="#DC2626" />
                      <Text style={styles.validationSummaryText}>
                        Please fix the errors above before publishing
                      </Text>
                    </View>
                  )}

                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        styles.publishButton,
                        (!isFormValid() || isPublishing || isCanceling) && styles.disabledButton
                      ]}
                      onPress={handlePublish}
                      disabled={!isFormValid() || isPublishing || isCanceling}
                    >
                      {isPublishing ? (
                        <View style={styles.publishingContainer}>
                          <View style={styles.publishingLoader}>
                            <ActivityIndicator size="small" color="#0C8806" />
                          </View>
                          <Text style={styles.actionButtonText}>
                            {isEditing ? 'Updating...' : 'Publishing...'}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View style={styles.buttonIcon}>
                            <Icon name="publish" size={16} color="#0468CE" />
                          </View>
                          <Text style={styles.actionButtonText}>
                            {isEditing ? 'Update' : 'Publish'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        styles.cancelButton,
                        (isPublishing || isCanceling) && styles.disabledButton
                      ]}
                      onPress={handleCancel}
                      disabled={isPublishing || isCanceling}
                    >
                      {isCanceling ? (
                        <>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Canceling...</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.actionButtonText}>Cancel</Text>
                          <View style={styles.buttonIcon}>
                            <Icon name="cancel" size={16} color="#0C8806" />
                          </View>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpText}>
                      * Required fields. Image is optional.
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function DetailsChannel({ channel, onBackPress }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [alertType, setAlertType] = useState('publish');

  // Load user posts on component mount
  useEffect(() => {
    loadUserPosts();
    loadLikesData();
  }, []);

  const loadUserPosts = async () => {
    try {
      const existingPosts = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      if (existingPosts) {
        setUserPosts(JSON.parse(existingPosts));
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const loadLikesData = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem(STORAGE_KEYS.POST_LIKES);
      if (storedLikes) {
        setLikesData(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error('Error loading likes data:', error);
    }
  };

  const handleViewProject = () => {
    console.log('View Project Details pressed');
    alert('View Project Details');
  };

  const handleManageFaculty = () => {
    console.log('Manage Faculty Settings pressed');
    alert('Manage Faculty Settings');
  };

  const handleAddPress = () => {
    console.log('Add button pressed');
    setEditingPost(null);
    setModalVisible(true);
  };

  const handleEditPost = (post) => {
    console.log('Edit post:', post);
    setEditingPost(post);
    setModalVisible(true);
  };

  const handleBackButtonPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPost(null);
  };

  const handlePublishSuccess = (newPost, isEditing = false) => {
    if (isEditing) {
      // Update the existing post in the state
      setUserPosts(prevPosts => 
        prevPosts.map(post => post.id === newPost.id ? newPost : post)
      );
      setAlertType('edit');
    } else {
      // Add the new post to the beginning of the posts array
      setUserPosts(prevPosts => [newPost, ...prevPosts]);
      setAlertType('publish');
    }
    setShowSuccessAlert(true);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const handleCreateFirstPost = () => {
    setEditingPost(null);
    setModalVisible(true);
  };

  const handleLike = async (postId, liked) => {
    try {
      const storedLikes = await AsyncStorage.getItem(STORAGE_KEYS.POST_LIKES);
      const allLikes = storedLikes ? JSON.parse(storedLikes) : {};
      
      const currentLikes = allLikes[postId] || { count: 0, liked: false };
      const newCount = liked ? currentLikes.count + 1 : Math.max(0, currentLikes.count - 1);
      
      allLikes[postId] = {
        count: newCount,
        liked: liked
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.POST_LIKES, JSON.stringify(allLikes));
      setLikesData(allLikes);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleComment = (postId, postTitle) => {
    setSelectedPost({ id: postId, title: postTitle });
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
    // Reload posts to update comment counts
    loadUserPosts();
  };

  const handleDelete = (postId, postTitle) => {
    setPostToDelete({ id: postId, title: postTitle });
    setShowDeleteAlert(true);
  };

  const handleCloseDeleteAlert = () => {
    setShowDeleteAlert(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      // Remove post from storage
      const existingPosts = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      if (existingPosts) {
        const posts = JSON.parse(existingPosts);
        const updatedPosts = posts.filter(post => post.id !== postToDelete.id);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(updatedPosts));
        setUserPosts(updatedPosts);
      }

      // Remove post likes
      const storedLikes = await AsyncStorage.getItem(STORAGE_KEYS.POST_LIKES);
      if (storedLikes) {
        const allLikes = JSON.parse(storedLikes);
        delete allLikes[postToDelete.id];
        await AsyncStorage.setItem(STORAGE_KEYS.POST_LIKES, JSON.stringify(allLikes));
        setLikesData(allLikes);
      }

      // Remove post comments
      const storedComments = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
      if (storedComments) {
        const allComments = JSON.parse(storedComments);
        delete allComments[postToDelete.id];
        await AsyncStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(allComments));
      }

      setShowDeleteAlert(false);
      setAlertType('delete');
      setShowSuccessAlert(true);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainContainer}>
        
        {/* Updated Header with Setting Channel Style Back Button */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleBackButtonPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={25} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.channelDetailsText}>Channel Details</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleAddPress} style={styles.addButton}>
            <View style={styles.greenCircle}>
              <Icon name="add" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          <View style={styles.courseSection}>
            <View style={styles.courseInfo}>
              <View style={styles.courseIconContainer}>
                <Icon name="school" size={24} color="#25282d" />
              </View>
              <Text style={styles.courseTitle}>
                <Text style={styles.hashTag}># </Text>
                {channel ? `${channel.name} - Advanced AI Principles` : 'B14 - Advanced AI Principles'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.facultyButton} onPress={handleManageFaculty}>
            <View style={styles.facultyButtonContent}>
              <View style={styles.facultyIconContainer}>
                <Icon name="manage-accounts" size={20} color="#ffffff" />
              </View>
              <Text style={styles.facultyButtonText}>Manage Faculty Settings</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.pinnedPostCard}>
            <View style={styles.postHeader}>
              <View style={styles.pinIconContainer}>
                <Icon name="push-pin" size={19} color="#33353a" />
                <Text style={styles.pinnedPostText}>Pinned Post</Text>
              </View>
              <Text style={styles.postDate}>Dec 10, 2025</Text>
            </View>

            <Image 
              source={{ uri: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-29/ci4ukg2Fuf.png' }}
              style={styles.postImage}
            />

            <Text style={styles.postTitle}>
              Real-time Neural Network{'\n'}Optimization
            </Text>

            <Text style={styles.postDescription}>
              this final project explores novel technique{'\n'}
              for optimizing neural network perform....{'\n'}
              real-time streaming data and informing{'\n\n'}
            </Text>

            <TouchableOpacity style={styles.projectButton} onPress={handleViewProject}>
              <View style={styles.projectButtonContent}>
                <Text style={styles.projectButtonText}>View Project Details</Text>
                <View style={styles.buttonIconContainer}>
                  <Icon name="arrow-forward" size={16} color="#ffffff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Posts Section */}
          <View style={styles.userPostsSection}>
            <Text style={styles.userPostsTitle}>Channel Posts</Text>
            
            {userPosts.length === 0 ? (
              <EmptyPostsState onAddPost={handleCreateFirstPost} />
            ) : (
              userPosts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  index={index}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDelete}
                  onEdit={handleEditPost}
                  likesData={likesData}
                />
              ))
            )}
          </View>

        </ScrollView>
        
        <ModelPostModal 
          visible={modalVisible} 
          onClose={handleCloseModal}
          onPublishSuccess={handlePublishSuccess}
          editingPost={editingPost}
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
        />

        <CommentModal
          visible={showCommentModal}
          onClose={handleCloseCommentModal}
          postId={selectedPost?.id}
          postTitle={selectedPost?.title}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  // Updated Header Styles to match SettingChannel
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40, // Adjust this to position the text closer to the arrow
  },
  channelDetailsText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#67696f',
    textAlign: 'center',
  },
  addButton: {
    padding: 5,
  },
  greenCircle: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseSection: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  courseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  courseTitle: {
    color: '#25282d',
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  hashTag: {
    color: '#0468ce',
  },
  facultyButton: {
    backgroundColor: '#0468ce',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 6,
    height: 43,
    justifyContent: 'center',
  },
  facultyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  facultyIconContainer: {
    marginRight: 10,
  },
  facultyButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
  },
  pinnedPostCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    borderRadius: 10,
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pinIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinnedPostText: {
    color: '#33353a',
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    marginLeft: 10,
  },
  postDate: {
    color: '#797e89',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 28,
  },
  postImage: {
    width: '100%',
    height: 158,
    borderRadius: 6,
    marginBottom: 15,
  },
  postTitle: {
    color: '#33353a',
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    marginBottom: 10,
  },
  postDescription: {
    color: '#797e89',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 28,
    marginBottom: 15,
  },
  projectButton: {
    backgroundColor: '#0468ce',
    borderRadius: 6,
    height: 43,
    justifyContent: 'center',
    marginTop: 10,
  },
  projectButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  projectButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
  },
  buttonIconContainer: {
    width: 29,
    height: 29,
    borderRadius: 14.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // User Posts Section
  userPostsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  userPostsTitle: {
    color: '#25282d',
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  // Post Card Styles
  postCard: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    borderRadius: 10,
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  postTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  postCardTitle: {
    color: '#33353a',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  postHeaderRight: {
    alignItems: 'flex-end',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editPostButton: {
    padding: 4,
  },
  deletePostButton: {
    padding: 4,
  },
  postCardDate: {
    color: '#797e89',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  postCardImage: {
    width: '100%',
    height: 158,
    borderRadius: 6,
    marginVertical: 15,
  },
  postCardDescription: {
    color: '#797e89',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 15,
  },
  postCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  postActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  postActionText: {
    color: '#797e89',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  likedActionText: {
    color: '#0468ce',
  },
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#374151',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    color: '#6B7280',
    fontFamily: 'Poppins',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#0468ce',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
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
    maxHeight: '80%',
  },
  modalContent: {
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 500,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  // Model Post Styles - UPDATED STYLES
  postContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 12,
  },
  // Updated input styles
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 0,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Updated image upload styles
  imageUpload: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    height: 140,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  uploadIconContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 35,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageUploadText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#10B981',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    alignItems: 'center',
  },
  commentsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  // Updated checkbox styles
  checkbox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0468CE',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#0468CE',
    borderColor: '#0468CE',
  },
  disabledCheckbox: {
    opacity: 0.6,
  },
  commentsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  publishButton: {
    backgroundColor: '#0468CE',
    shadowColor: '#0468CE',
  },
  cancelButton: {
    backgroundColor: '#0C8806',
    shadowColor: '#0C8806',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  publishingLoader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Validation Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: '60%',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  validationSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    marginBottom: 16,
  },
  validationSummaryText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  helpTextContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
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
  // Comment Modal Styles
  commentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  commentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  commentModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  commentModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  commentCloseButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noCommentsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0468CE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  commentTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  commentSendButton: {
    backgroundColor: '#0468CE',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});