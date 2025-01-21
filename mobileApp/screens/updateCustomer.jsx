import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosInstance from '../hooks/axiosInstance'; 

const UpdateCustomer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { customerId } = route.params;

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    description: '',
  });
  
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`/customers/${customerId}`);
        if (response.data && response.data.success) {
          const data = response.data.data; 
          setCustomerData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            location: data.location || '',
            description: data.description || '',
          });
        } else {
          throw new Error('Failed to fetch customer data');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error.message);
        Alert.alert('Error', 'Failed to fetch customer data.');
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleChange = (name, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewDescriptionChange = (value) => {
    setNewDescription(value);
  };

  const handleAddDescription = () => {
    if (newDescription.trim()) {
      const timestamp = new Date().toLocaleString();
      const updatedDescription = `${customerData.description}\n[${timestamp}] ${newDescription}`;
      setCustomerData((prev) => ({
        ...prev,
        description: updatedDescription,
      }));
      setNewDescription('');
    } else {
      Alert.alert('Error', 'Description cannot be empty.');
    }
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/customers/${customerId}`, customerData);
      Alert.alert('Success', 'Customer updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating customer:', error.response?.data?.message || error.message);
      Alert.alert('Error', 'Failed to update customer.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={customerData.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={customerData.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={customerData.phoneNumber}
        onChangeText={(value) => handleChange('phoneNumber', value)}
      />
      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        value={customerData.location}
        onChangeText={(value) => handleChange('location', value)}
      />
      <Text style={styles.label}>Current Description:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]} // Independent height for current description
        value={customerData.description}
        editable={false}
        multiline
        textAlignVertical="top"
      />
      <Text style={styles.label}>Add New Description:</Text>
      <View style={styles.addDescriptionContainer}>
        <TextInput
          style={[styles.input, styles.newDescriptionInput]} // Fixed height for new description
          value={newDescription}
          onChangeText={handleNewDescriptionChange}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddDescription}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Customer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#333',
  },
  input: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    fontSize: 16,
  },
  addDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  newDescriptionInput: {
    height: 80, // Fixed height for new description
    flex: 1, // Allow the input to take available space
  },
  addButton: {
    backgroundColor: '#FFA500', // Orange color for the button
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'center', // Center button text vertically
  },
  updateButton: {
    backgroundColor: '#007BFF', // Blue color for "Update Customer"
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateCustomer;