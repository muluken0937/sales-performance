// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import axiosInstance from '../hooks/axiosInstance'; // Assuming axiosInstance is set up with baseURL and token handling
// import * as ImagePicker from 'expo-image-picker';

// function UpdateProfile({ userId, navigation }) {
//   const [formData, setFormData] = useState({ name: '', email: '' });
//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch user data to populate the form
//     const fetchUserData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const response = await axiosInstance.get(`/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const user = response.data.data;
//         setFormData({ name: user.name, email: user.email });
//         setPreviewImage(user.profileImage);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchUserData();
//   }, [userId]);

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = () => {
//     ImagePicker.launchImageLibrary({ noData: true }, (response) => {
//       if (response.didCancel) return;
//       setProfileImage(response.assets[0]);
//       setPreviewImage(response.assets[0].uri);
//     });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const token = await AsyncStorage.getItem('token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('email', formData.email);
//       if (profileImage) formDataToSend.append('image', {
//         uri: profileImage.uri,
//         type: profileImage.type,
//         name: profileImage.fileName,
//       });

//       const response = await axiosInstance.put(`/users/${userId}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setMessage(response.data.message || 'Profile updated successfully!');
//       Alert.alert(
//         'Profile Updated',
//         'Profile updated successfully! Click OK to go to the dashboard.',
//         [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
//       );
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error updating profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Profile</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.name}
//         onChangeText={(text) => handleChange('name', text)}
//         placeholder="Name"
//       />
//       <TextInput
//         style={styles.input}
//         value={formData.email}
//         onChangeText={(text) => handleChange('email', text)}
//         placeholder="Email"
//         keyboardType="email-address"
//       />
//       <View style={styles.imagePickerContainer}>
//         {previewImage && (
//           <Image source={{ uri: previewImage }} style={styles.imagePreview} />
//         )}
//         <TouchableOpacity onPress={handleFileChange} style={styles.imageButton}>
//           <Text style={styles.imageButtonText}>Select Profile Image</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity
//         style={[styles.button, loading && styles.buttonDisabled]}
//         onPress={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator size="small" color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Update Profile</Text>
//         )}
//       </TouchableOpacity>
//       {message && <Text style={styles.message}>{message}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   imagePickerContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   imageButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//   },
//   imageButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#b0c4de',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   message: {
//     marginTop: 20,
//     color: 'green',
//   },
// });

// export default UpdateProfile;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axiosInstance from '../hooks/axiosInstance'; // Assuming axiosInstance is set up as you mentioned
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UpdateProfile({ navigation }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log(userId); // Make sure it is not null or undefined

        const token = await AsyncStorage.getItem('token');
        const response = await axiosInstance.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.data;
        setFormData({ name: user.name, email: user.email });
        setPreviewImage(user.profileImage || null); // Use profileImage if available
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Error loading user data');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images], // Fix for deprecation warning
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      setPreviewImage(result.uri); // Update image preview
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId'); // Make sure userId is retrieved correctly
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      // Append image if selected
      if (profileImage) {
        const image = {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        };
        formDataToSend.append('image', image); // Ensure correct image format
      }

      const response = await axiosInstance.put(`/users/${userId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || 'Profile updated successfully!');

      // Show confirmation dialog and navigate to dashboard
      Alert.alert('Profile Updated', 'Profile updated successfully! Click OK to go to the dashboard.', [
        { text: 'OK', onPress: () => navigation.navigate('profile') },
      ]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile.');
      console.error('Profile update error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      {/* Profile Image Picker */}
      <View style={styles.imagePickerContainer}>
        {previewImage && <Image source={{ uri: previewImage }} style={styles.imagePreview} />}
        <TouchableOpacity onPress={handleFileChange} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Select Profile Image</Text>
        </TouchableOpacity>
      </View>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter your name"
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>

      {/* Message Feedback */}
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b0c4de',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    color: 'green',
  },
});

export default UpdateProfile;
