<<<<<<< HEAD
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    if (id === '837' && password === '12345') {
      setIsLoading(true);
      // Simulate API call with better loading animation
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)/HomeScreen');
      }, 1500);
    } else {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        '⚠️ Login Failed',
        'Invalid ID or password. Please check your credentials and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <LinearGradient
      colors={['#f9fafb', '#dbeafe', '#ffffff']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              {/* <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                style={styles.logo}
              >
                <Ionicons name="school" size={40} color="#ffffff" />
              </LinearGradient> */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>JU Hub</Text>
                <Text style={styles.subtitle}>jazeera University Community Platform</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Login Form */}
          <Animated.View 
            style={[
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Student ID Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="person-circle-outline" size={16} color="#3b82f6" /> YOUR ID
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your student ID"
                  placeholderTextColor="#9ca3af"
                  value={id}
                  onChangeText={setId}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  selectionColor="#3b82f6"
                />
                {id.length > 0 && (
                  <TouchableOpacity onPress={() => setId('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#d1d5db" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="lock-closed-outline" size={16} color="#3b82f6" /> PASSWORD
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  selectionColor="#3b82f6"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                  <Ionicons 
                    name={isPasswordVisible ? "eye-off" : "eye"} 
                    size={20} 
                    color="#3b82f6" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.helpersContainer}>
              <TouchableOpacity style={styles.rememberMe}>
                <View style={styles.checkbox}>
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                isLoading && styles.loginButtonDisabled,
                (!id || !password) && styles.loginButtonDisabled
              ]} 
              onPress={handleLogin}
              disabled={isLoading || !id || !password}
            >
              <LinearGradient
                colors={(!id || !password) ? ['#e5e7eb', '#d1d5db'] : ['#3b82f6', '#1e40af']}
                style={styles.gradientButton}
              >
                {isLoading ? (
                  <Animated.View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={20} color="#ffffff" />
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  </Animated.View>
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#ffffff" />
                    <Text style={styles.loginButtonText}>Sign In to JU Hub</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={18} color="#3b82f6" />
                <Text style={styles.demoTitle}>Demo Credentials</Text>
              </View>
              <View style={styles.credentialsGrid}>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Student ID:</Text>
                  <Text style={styles.credentialValue}>837</Text>
                </View>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Password:</Text>
                  <Text style={styles.credentialValue}>12345</Text>
                </View>
              </View>
            </View>

            {/* Sign Up Prompt */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to JU Hub? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.footerText}>🎓 JU Hub Community Platform</Text>
            <Text style={styles.footerSubtext}>Connecting Students • Version 1.0</Text>
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
    textShadowColor: 'rgba(59, 130, 246, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    paddingRight: 50,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 14,
    padding: 4,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 14,
    padding: 4,
  },
  helpersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  demoContainer: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 6,
  },
  credentialsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  credentialItem: {
    alignItems: 'center',
  },
  credentialLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  credentialValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    if (id === '837' && password === '12345') {
      setIsLoading(true);
      // Simulate API call with better loading animation
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)/HomeScreen');
      }, 1500);
    } else {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        '⚠️ Login Failed',
        'Invalid ID or password. Please check your credentials and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <LinearGradient
      colors={['#f9fafb', '#dbeafe', '#ffffff']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              {/* <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                style={styles.logo}
              >
                <Ionicons name="school" size={40} color="#ffffff" />
              </LinearGradient> */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>JU Hub</Text>
                <Text style={styles.subtitle}>jazeera University Community Platform</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Login Form */}
          <Animated.View 
            style={[
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Student ID Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="person-circle-outline" size={16} color="#3b82f6" /> YOUR ID
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your student ID"
                  placeholderTextColor="#9ca3af"
                  value={id}
                  onChangeText={setId}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  selectionColor="#3b82f6"
                />
                {id.length > 0 && (
                  <TouchableOpacity onPress={() => setId('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#d1d5db" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="lock-closed-outline" size={16} color="#3b82f6" /> PASSWORD
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  selectionColor="#3b82f6"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                  <Ionicons 
                    name={isPasswordVisible ? "eye-off" : "eye"} 
                    size={20} 
                    color="#3b82f6" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.helpersContainer}>
              <TouchableOpacity style={styles.rememberMe}>
                <View style={styles.checkbox}>
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                isLoading && styles.loginButtonDisabled,
                (!id || !password) && styles.loginButtonDisabled
              ]} 
              onPress={handleLogin}
              disabled={isLoading || !id || !password}
            >
              <LinearGradient
                colors={(!id || !password) ? ['#e5e7eb', '#d1d5db'] : ['#3b82f6', '#1e40af']}
                style={styles.gradientButton}
              >
                {isLoading ? (
                  <Animated.View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={20} color="#ffffff" />
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  </Animated.View>
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#ffffff" />
                    <Text style={styles.loginButtonText}>Sign In to JU Hub</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={18} color="#3b82f6" />
                <Text style={styles.demoTitle}>Demo Credentials</Text>
              </View>
              <View style={styles.credentialsGrid}>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Student ID:</Text>
                  <Text style={styles.credentialValue}>837</Text>
                </View>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Password:</Text>
                  <Text style={styles.credentialValue}>12345</Text>
                </View>
              </View>
            </View>

            {/* Sign Up Prompt */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to JU Hub? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.footerText}>🎓 JU Hub Community Platform</Text>
            <Text style={styles.footerSubtext}>Connecting Students • Version 1.0</Text>
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
    textShadowColor: 'rgba(59, 130, 246, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    paddingRight: 50,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 14,
    padding: 4,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 14,
    padding: 4,
  },
  helpersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  demoContainer: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 6,
  },
  credentialsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  credentialItem: {
    alignItems: 'center',
  },
  credentialLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  credentialValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

>>>>>>> 7257217c (Added Our sections)
export default Login;