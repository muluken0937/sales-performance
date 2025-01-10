import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../hooks/axiosInstance"; // Import the axiosInstance

export default function Notifications() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        // Attach the token dynamically
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

        const response = await axiosInstance.get("/customers", {
          params: { isPendingApproval: true },
        });

        const approvals = response.data.data.filter(
          (customer) =>
            customer.isPendingApproval && (customer.paidStatus || customer.visitStatus)
        );

        setPendingApprovals(approvals);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  const handleApproval = async (customerId) => {
    try {
      const response = await axiosInstance.patch(`/customers/${customerId}/approve`);

      if (response.data.success) {
        alert("Status approved successfully");
        setPendingApprovals((prev) =>
          prev.filter((customer) => customer._id !== customerId)
        );
      }
    } catch (error) {
      console.error("Error approving status:", error);
      alert("Failed to approve status.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading pending approvals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {pendingApprovals.length === 0 ? (
        <Text style={styles.noApprovals}>No pending approvals.</Text>
      ) : (
        <FlatList
          data={pendingApprovals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.status}>
                {item.paidStatus && "Paid, "}
                {item.visitStatus && "Visited"}
              </Text>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApproval(item._id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noApprovals: {
    fontSize: 16,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    marginVertical: 10,
    color: "#888",
  },
  approveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
