import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Animated 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../hooks/axiosInstance';

const CreateCustomerScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    description: '',
  });

  const [descriptionHeight, setDescriptionHeight] = useState(40);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const animationValue = useRef(new Animated.Value(0)).current;

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessages((prev) => ({ ...prev, [name]: '' })); // Clear error message on input change
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required.';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required.';
    if (!formData.location) errors.location = 'Location is required.';
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessages(validationErrors);
      return; // Stop submission if there are validation errors
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID is required');

      const response = await axiosInstance.post('/customers', { 
        ...formData,  
        createdBy: userId 
      });

      console.log('Customer created:', response.data);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        location: '',
        description: '',
      });
      
      setSuccessMessage('Customer created successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Error creating customer:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create customer. Please try again.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(animationValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }, 5000);
      });
    }
  }, [successMessage]);

  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20]
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Customer</Text>

          {/* Input Fields */}
          {['name', 'email', 'phoneNumber', 'location'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errorMessages[field] && styles.inputError
                ]}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter ${field}`}
                keyboardType={
                  field === 'email' ? 'email-address' :
                  field === 'phoneNumber' ? 'phone-pad' : 'default'
                }
              />
              {errorMessages[field] && (
                <Text style={styles.errorText}>{errorMessages[field]}</Text>
              )}
            </View>
          ))}

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[
                styles.input, 
                styles.descriptionInput, 
                { height: Math.max(40, descriptionHeight) }
              ]}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              placeholder="Enter description"
              multiline
              onContentSizeChange={(e) => {
                setDescriptionHeight(e.nativeEvent.contentSize.height);
              }}
              textAlignVertical="top"
            />
          </View>

          {/* Success Message Above Submit Button */}
          {successMessage ? (
            <Animated.View style={[
              styles.successMessage,
              {
                transform: [{ translateX }, { translateY }],
                marginBottom: 20, // Add margin to separate from button
              }
            ]}>
              <Text style={styles.successText}>{successMessage}</Text>
            </Animated.View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Customer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0891b2',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#065f46',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#334155',
  },
  input: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 40,
  },
  inputError: {
    borderColor: 'red', // Highlighting the border in red for errors
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  descriptionInput: {
    paddingVertical: 10,
    height: 'auto',
    minHeight: 50,
    paddingBottom: 50,

    
  },
  button: {
    backgroundColor: '#0891b2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateCustomerScreen;