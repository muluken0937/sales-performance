import React, { useState, useEffect } from 'react';
import axiosInstance from "../hooks/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterUser() {
  const [userRole, setUserRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setUserRole(storedRole);
      const roles = getAvailableRoles(storedRole);
      setRegisterRole(roles[0] || '');
    };
    fetchUserRole();
  }, []);

  const getAvailableRoles = (role) => {
    if (role === 'Admin') {
      return ['SalesManager', 'SalesUser'];
    } else if (role === 'SalesManager') {
      return ['SalesUser'];
    }
    return [];
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', registerRole);
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`${registerRole} registered successfully.`);
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setImage(null);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register {registerRole}</Text>
      {userRole === 'SalesUser' ? (
        <Text style={styles.errorText}>You are not authorized to register new users.</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Role</Text>
          <View style={styles.rolePicker}>
            {getAvailableRoles(userRole).map((role) => (
              <TouchableOpacity key={role} onPress={() => setRegisterRole(role)}>
                <Text style={registerRole === role ? styles.selectedRole : styles.role}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {image && <Text style={styles.imageText}>Image selected!</Text>}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>
          {message && <Text style={styles.message}>{message}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    bottom:30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  rolePicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  role: {
    padding: 10,
    fontSize: 16,
  },
  selectedRole: {
    padding: 10,
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    color: 'green',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});