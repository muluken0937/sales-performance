import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import axiosInstance from "../hooks/axiosInstance";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SalesPerformance = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesUser, setSelectedSalesUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/customers");
      setCustomers(response.data.data);
      setError(null);
    } catch (err) {
      setError("Error fetching customers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh customers when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCustomers();
    }, [])
  );

  // You can still keep an initial load if needed.
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };

  const handleEdit = () => {
    if (selectedCustomer) {
      navigation.navigate('UpdateCustomer', { customerId: selectedCustomer._id });
      handleCloseDetail();
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axiosInstance.delete(`/customers/${customerId}`);
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== customerId));
      Alert.alert("Success", "Customer deleted successfully.");
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert("Error", "Failed to delete customer.");
    }
  };

  const confirmDelete = (customerId) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDelete(customerId), style: "destructive" },
      ]
    );
  };

  const handleStatusChange = async (customerId, statusType, value) => {
    try {
      const response = await axiosInstance.patch(`/customers/${customerId}/status`, {
        [statusType]: value,
      });

      if (response.data.success) {
        Alert.alert("Success", `${statusType} updated successfully.`);
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) => {
            if (customer._id === customerId) {
              return { ...customer, [statusType]: value };
            }
            return customer;
          })
        );

        if (selectedCustomer && selectedCustomer._id === customerId) {
          setSelectedCustomer((prev) => ({ ...prev, [statusType]: value }));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  const handleSwitchChange = (customerId, statusType) => {
    const customer = customers.find((cust) => cust._id === customerId);
    if (!customer[statusType]) {
      handleStatusChange(customerId, statusType, true);
    }
  };

  const salesUsers = [...new Set(customers.map((customer) => customer.createdBy.name))];

  const filteredCustomers = selectedSalesUser
    ? customers.filter((customer) => customer.createdBy.name === selectedSalesUser)
    : customers;

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
      <Text style={styles.title}>Sales Performance</Text>
      <Text style={styles.subtitle}>{filteredCustomers.length} Customers</Text>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select User:</Text>
        <FlatList
          horizontal
          data={["All Users", ...salesUsers]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                (item === selectedSalesUser || (item === "All Users" && selectedSalesUser === "")) 
                  ? styles.filterButtonActive 
                  : null,
              ]}
              onPress={() => setSelectedSalesUser(item === "All Users" ? "" : item)}
            >
              <Text style={styles.filterButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.customerCard}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => handleCustomerClick(item)}
            >
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerEmail}>Email: {item.email}</Text>
              <Text style={styles.detailPrompt}>Tap for more details</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Description', { customerId: item._id })}
                style={styles.descriptionLinkContainer}
              >
                <Text style={styles.descriptionLink}>View Description</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item._id)}>
              <Icon name="delete" size={24} color="red" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedCustomer && (
        <Modal
          transparent={true}
          visible={!!selectedCustomer}
          animationType="slide"
          onRequestClose={handleCloseDetail}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCustomer.name}</Text>
              <View style={styles.infoRow}>
                <Icon name="email" size={20} color="#007BFF" />
                <Text style={[styles.modalText, styles.infoText]}>{selectedCustomer.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#007BFF" />
                <Text style={[styles.modalText, styles.infoText]}>{selectedCustomer.phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="place" size={20} color="#007BFF" />
                <Text style={[styles.modalText, styles.infoText]}>{selectedCustomer.location}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Paid Status:</Text>
                <Switch
                  value={selectedCustomer.paidStatus}
                  onValueChange={() =>
                    handleSwitchChange(selectedCustomer._id, "paidStatus")
                  }
                />
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Visit Status:</Text>
                <Switch
                  value={selectedCustomer.visitStatus}
                  onValueChange={() =>
                    handleSwitchChange(selectedCustomer._id, "visitStatus")
                  }
                />
              </View>
              <View style={styles.infoRow}>
                <Icon name="person" size={20} color="#007BFF" />
                <Text style={[styles.modalText, styles.infoText]}>
                  {selectedCustomer.createdBy.name} (Email: {selectedCustomer.createdBy.email})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="access-time" size={20} color="#007BFF" />
                <Text style={[styles.modalText, styles.infoText]}>
                  {new Date(selectedCustomer.createdAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseDetail}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    marginBottom: 50,
  },
  title: {
    color: "#0891b2",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#0e7490",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 19,
    marginBottom: 8,
    color: "#a9740"
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: "#0891b2",
  },
  filterButtonText: {
    color: "#fff",
  },
  customerCard: {
    backgroundColor: "#f0f9ff",
    padding: 18,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#0891b2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#0891b2",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c4a6e",
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  detailPrompt: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  descriptionLink: {
    color: "#0891b2",
    fontWeight: "500",
    textDecorationLine: "underline",
    fontSize: 16,
    paddingLeft :60,
    paddingTop: 5,
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
    borderColor: "#0891b2",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0c4a6e",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 12,
    width: '100%', // Add this
    textAlign: 'center', // Add this
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: '100%', // Add this
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: '100%', // Add this
  },
  statusLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  editButton: {
    padding: 12,
    backgroundColor: "#0891b2",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
    flex: 1,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 12,
    backgroundColor: "#ff6347",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default SalesPerformance;