import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosInstance from '../hooks/axiosInstance';

const UpdateCustomer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { customerId } = route.params;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const [descriptions, setDescriptions] = useState([]);
  const [newDescription, setNewDescription] = useState('');

  // Fetch customer data on component mount
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`/customers/${customerId}`);
        if (response.data?.success) {
          const data = response.data.data;
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            location: data.location || '',
          });
          setDescriptions(data.descriptions || []);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch customer data');
      }
    };
    fetchCustomer();
  }, [customerId]);

  // Handle changes in form fields
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new description
  const handleAddDescription = async () => {
    if (!newDescription.trim()) {
      Alert.alert('Error', 'Description cannot be empty.');
      return;
    }

    try {
      // Send only the new description to be appended
      const response = await axiosInstance.put(`/customers/${customerId}`, {
        ...formData,
        description: newDescription, // This will trigger the backend's append logic
      });

      // Update local state with the new description from response
      setDescriptions(response.data.data.descriptions);
      setNewDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add description');
    }
  };

  // Update customer details
  const handleSubmit = async () => {
    try {
      // Update main fields without sending description
      await axiosInstance.put(`/customers/${customerId}`, formData);
      Alert.alert('Success', 'Customer updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update customer details');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={descriptions}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            {/* Form Fields */}
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(v) => handleFieldChange('name', v)}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(v) => handleFieldChange('email', v)}
            />

            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(v) => handleFieldChange('phoneNumber', v)}
            />

            <Text style={styles.label}>Location:</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(v) => handleFieldChange('location', v)}
            />

            {/* Description History */}
            <Text style={styles.sectionTitle}>Description History</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No descriptions yet</Text>
        }
        ListFooterComponent={
          <>
            {/* New Description Input */}
            <Text style={styles.sectionTitle}>Add New Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter new description"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDescription}
            >
              <Text style={styles.buttonText}>Add </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Customer Details</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  contentContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  descriptionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: '#7891b2',
    borderRadius: 5,
    padding: 14,
    alignItems: 'center',
    marginVertical: 8,
    width:100,
    marginLeft:220,
  paddingtop:10,

  },
  updateButton: {
    backgroundColor: '#0891b2',
    borderRadius: 5,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UpdateCustomer;