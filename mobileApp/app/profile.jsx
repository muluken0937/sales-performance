import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../hooks/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found.");
        }

        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleCancel = () => {
    navigation.navigate("index");
  };

  const handleUpdateProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${axiosInstance.defaults.baseURL.replace('/api', '')}${user?.profileImage}` }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        {user?.profileImage && (
          <Image
            source={{ uri: `${axiosInstance.defaults.baseURL.replace('/api', '')}${user.profileImage}` }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Name: </Text>
          {user?.name}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Email: </Text>
          {user?.email}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Role: </Text>
          {user?.role}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    margin: 30,
    marginBottom: 90,
    borderRadius: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    width: "80%",
    padding: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Profile;
