import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../hooks/axiosInstance";

export default function Navbar() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ role: "", name: "", image: "" });
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    navigation.navigate("Login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const name = await AsyncStorage.getItem("userName");
      const image = await AsyncStorage.getItem("userImage");
      setIsLoggedIn(!!token);
      setUserDetails({ role, name, image });

      if (token) {
        try {
          const response = await axiosInstance.get("/customers", {
            params: { isPendingApproval: true },
          });

          const approvals = response.data.data.filter(customer =>
            customer.isPendingApproval && (customer.paidStatus || customer.visitStatus)
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
      <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.profileSection}>
        {userDetails.image ? (
          <Image
            source={{ uri: `http://192.168.88.191:5000${userDetails.image}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{userDetails.name?.[0] || "?"}</Text>
          </View>
        )}
        <View>
          <Text style={styles.profileName}>{userDetails.name || "Unknown User"}</Text>
          <Text style={styles.profileRole}>{userDetails.role}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {isLoggedIn && (
          <TouchableOpacity onPress={() => navigation.navigate(getRegisterLink())}>
            <Text style={styles.registerLink}>
              Register{" "}
              {userDetails.role === "Admin"
                ? "Manager"
                : userDetails.role === "SalesManager"
                ? "SalesUser"
                : "Customer"}
            </Text>
          </TouchableOpacity>
        )}
        {isLoggedIn && userDetails.role === "SalesManager" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={styles.notificationIcon}
          >
            <Text>🔔</Text>
            {notificationCount > 0 && <Text style={styles.notificationBadge}>{notificationCount}</Text>}
          </TouchableOpacity>
        )}
        {isLoggedIn ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.login}>Login</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: "#fff",
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
    flexDirection: "row",
    alignItems: "center",
  },
  registerLink: {
    marginRight: 10,
    color: "#0891b2",
  },
  notificationIcon: {
    position: "relative",
    marginRight: 10,
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
  login: {
    color: "#0891b2",
  },
});
