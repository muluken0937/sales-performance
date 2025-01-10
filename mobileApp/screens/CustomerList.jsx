import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../hooks/axiosInstance"; // Import axiosInstance

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        const token = await AsyncStorage.getItem("token");

        if (token) {
          axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        }

        setRole(storedRole);

        const response = await axiosInstance.get("/customers");
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        Alert.alert("Error", "Failed to fetch customers.");
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (customerId, statusType, value) => {
    try {
      const response = await axiosInstance.patch(`/customers/${customerId}/status`, {
        [statusType]: value,
      });

      if (response.data.success) {
        Alert.alert("Success", "Status updated and pending approval.");
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) => {
            if (customer._id === customerId) {
              return { ...customer, [statusType]: value, isPendingApproval: true };
            }
            return customer;
          })
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  const handleSwitchChange = (customerId, statusType) => {
    const customer = customers.find((cust) => cust._id === customerId);
    const newValue = !customer[statusType];
    handleStatusChange(customerId, statusType, newValue);
  };

  const isSwitchDisabled = (customer, statusType) => {
    return customer.isPendingApproval && !(customer[statusType] === false);
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.customerItem}>
      <Text style={styles.customerName}>{item.name}</Text>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Paid:</Text>
        <Switch
          value={role === "SalesUser" ? item.paidStatus : !item.isPendingApproval && item.paidStatus}
          onValueChange={() => {
            if (role === "SalesUser" || !item.isPendingApproval) {
              handleSwitchChange(item._id, "paidStatus");
            }
          }}
          disabled={isSwitchDisabled(item, "paidStatus")}
        />
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Visited:</Text>
        <Switch
          value={role === "SalesUser" ? item.visitStatus : !item.isPendingApproval && item.visitStatus}
          onValueChange={() => {
            if (role === "SalesUser" || !item.isPendingApproval) {
              handleSwitchChange(item._id, "visitStatus");
            }
          }}
          disabled={isSwitchDisabled(item, "visitStatus")}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customer List</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomer}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No customers found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  customerItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
