import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ActivityIndicator } from "react-native";
import axiosInstance from "../hooks/axiosInstance";

const SalesPerformance = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesUser, setSelectedSalesUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/customers");
        setCustomers(response.data.data);
      } catch (err) {
        setError("Error fetching customers. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };

  // Extract unique sales users from customers
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
        <Text style={styles.label}>Select Sales User:</Text>
        <FlatList
          horizontal
          data={["All Users", ...salesUsers]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                item === selectedSalesUser ? styles.filterButtonActive : null,
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
          <TouchableOpacity
            style={styles.customerCard}
            onPress={() => handleCustomerClick(item)}
          >
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerEmail}>Email: {item.email}</Text>
            <Text style={styles.detailPrompt}>Tap for more details</Text>
          </TouchableOpacity>
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
              <Text style={styles.modalText}>Email: {selectedCustomer.email}</Text>
              <Text style={styles.modalText}>Phone: {selectedCustomer.phoneNumber}</Text>
              <Text style={styles.modalText}>Location: {selectedCustomer.location}</Text>
              <Text style={styles.modalText}>
                Description: {selectedCustomer.description || "N/A"}
              </Text>
              <Text
                style={[
                  styles.modalText,
                  selectedCustomer.paidStatus ? styles.textPaid : styles.textUnpaid,
                ]}
              >
                Paid Status: {selectedCustomer.paidStatus ? "Paid" : "Unpaid"}
              </Text>
              <Text
                style={[
                  styles.modalText,
                  selectedCustomer.visitStatus ? styles.textVisited : styles.textNotVisited,
                ]}
              >
                Visit Status: {selectedCustomer.visitStatus ? "Visited" : "Not Visited"}
              </Text>
              <Text style={styles.modalText}>
                Created By: {selectedCustomer.createdBy.name} (Email:{" "}
                {selectedCustomer.createdBy.email})
              </Text>
              <Text style={styles.modalText}>
                Created At: {new Date(selectedCustomer.createdAt).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseDetail}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginBottom:50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: "#007bff",
  },
  filterButtonText: {
    color: "#fff",
  },
  customerCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  customerEmail: {
    fontSize: 14,
    marginVertical: 4,
  },
  detailPrompt: {
    fontSize: 12,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
  },
  textPaid: {
    color: "green",
  },
  textUnpaid: {
    color: "red",
  },
  textVisited: {
    color: "green",
  },
  textNotVisited: {
    color: "red",
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
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

export default SalesPerformance;
