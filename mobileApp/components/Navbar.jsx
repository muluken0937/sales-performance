
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../hooks/axiosInstance";

export default function Navbar({ onLogout }) {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ role: "", name: "", image: "" });
  const [notificationCount, setNotificationCount] = useState(0);
  const [baseURL, setBaseURL] = useState("");

  useEffect(() => {
    // Fetch base URL from axiosInstance
    setBaseURL(axiosInstance.defaults.baseURL.replace("/api", ""));

    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const name = await AsyncStorage.getItem("userName");
      const image = await AsyncStorage.getItem("userImage");
      setUserDetails({ role, name, image });

      if (token) {
        try {
          const response = await axiosInstance.get("/customers", {
            params: { isPendingApproval: true },
          });

          const approvals = response.data.data.filter(
            (customer) =>
              customer.isPendingApproval &&
              (customer.paidStatus || customer.visitStatus)
          );

          setNotificationCount(approvals.length);
        } catch (error) {
          console.error("Error fetching pending approvals:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const getRegisterLink = () => {
    switch (userDetails.role) {
      case "Admin":
      case "SalesManager":
        return "RegisterManager";
      case "SalesUser":
        return "RegisterCustomer";
      default:
        return "Register";
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("profile")}
        style={styles.profileSection}
      >
        {userDetails.image ? (
          <Image
            source={{ uri: `${baseURL}${userDetails.image}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {userDetails.name?.[0] || "?"}
            </Text>
          </View>
        )}
        <View>
          <Text style={styles.profileName}>{userDetails.name || "Unknown User"}</Text>
          <Text style={styles.profileRole}>{userDetails.role}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {userDetails.role === "SalesManager" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={styles.notificationIcon}
          >
            <Text>🔔</Text>
            {notificationCount > 0 && (
              <Text style={styles.notificationBadge}>{notificationCount}</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 12,
    color: "#555",
  },
  actions: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  notificationIcon: {
    marginBottom: 10,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    fontSize: 10,
    borderRadius: 10,
    padding: 2,
  },
  logout: {
    color: "red",
  },
});
