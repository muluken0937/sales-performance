// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axiosInstance from '../hooks/axiosInstance';

// const CreateCustomerScreen = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     location: '',
//     description: '',
//   });

//   const handleChange = (name, value) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');

//       if (!userId) {
//         throw new Error('User ID is required');
//       }

//       const response = await axiosInstance.post('/customers', { ...formData, createdBy: userId });

//       console.log('Customer created:', response.data);
//       setFormData({
//         name: '',
//         email: '',
//         phoneNumber: '',
//         location: '',
//         description: '',
//       });
//       Alert.alert('Success', 'Customer created successfully!');
//     } catch (error) {
//       console.error('Error creating customer:', error.response ? error.response.data : error.message);
//       Alert.alert('Error', 'Failed to create customer. Please try again.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Create Customer</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Name:</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.name}
//               onChangeText={(text) => handleChange('name', text)}
//               placeholder="Enter name"
//               required
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email:</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.email}
//               onChangeText={(text) => handleChange('email', text)}
//               placeholder="Enter email"
//               keyboardType="email-address"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Phone Number:</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.phoneNumber}
//               onChangeText={(text) => handleChange('phoneNumber', text)}
//               placeholder="Enter phone number"
//               required
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Location:</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.location}
//               onChangeText={(text) => handleChange('location', text)}
//               placeholder="Enter location"
//               required
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Description:</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.description}
//               onChangeText={(text) => handleChange('description', text)}
//               placeholder="Enter description"
//               multiline
//             />
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//             <Text style={styles.buttonText}>Create Customer</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#eee',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingBottom: 60, // Leave space at the bottom
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default CreateCustomerScreen;


import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
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
  
  const [descriptionHeight, setDescriptionHeight] = useState(40); // Initial height

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axiosInstance.post('/customers', { ...formData, createdBy: userId });

      console.log('Customer created:', response.data);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        location: '',
        description: '',
      });
      Alert.alert('Success', 'Customer created successfully!');
    } catch (error) {
      console.error('Error creating customer:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to create customer. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Customer</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter name"
              required
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              required
            />
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location:</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="Enter location"
              required
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput, { height: Math.max(40, descriptionHeight) }]}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              placeholder="Enter description"
              multiline
              onContentSizeChange={(event) => {
                setDescriptionHeight(event.nativeEvent.contentSize.height);
              }}
              textAlignVertical="top" // Ensures text starts at the top-left
            />
          </View>

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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eee',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60, // Leave space at the bottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateCustomerScreen;
