import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import axiosInstance from "../hooks/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/customers/");
        if (response.data.success) {
          setCustomers(response.data.data);
          calculateStatusCounts(response.data.data);
        } else {
          throw new Error(response.data.message || "Unknown error occurred");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCustomers();
  }, []);

  const calculateStatusCounts = (data) => {
    const counts = { paid: 0, visited: 0, both: 0, neither: 0 };
    data.forEach((item) => {
      const { paidStatus, visitStatus, isPendingApproval } = item;
      if (!paidStatus && !visitStatus && !isPendingApproval) counts.neither += 1;
      else if (paidStatus && !visitStatus && !isPendingApproval) counts.paid += 1;
      else if (!paidStatus && visitStatus && !isPendingApproval) counts.visited += 1;
      else if (paidStatus && visitStatus && !isPendingApproval) counts.both += 1;
    });
    setTotalCustomers(data.length);
    setPieData([
      { name: "Paid", population: counts.paid, color: "#4caf50" },
      { name: "Visited", population: counts.visited, color: "#2196f3" },
      { name: "Both", population: counts.both, color: "#ff9800" },
      { name: "Neither", population: counts.neither, color: "#f44336" },
    ]);
  };

 // Update the fetchStatusCounts useEffect
useEffect(() => {
  const fetchStatusCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/customers/status-counts?period=${period}`);
      if (response.data.success) {
        const filteredData = response.data.data
          .filter(item => !item.isPendingApproval)
          .map(item => ({
            label: item._id,
            // Only count if isPendingApproval is false and status is true
            paidCount: customers.filter(c => 
              c.paidStatus && 
              !c.isPendingApproval &&
              c.createdAt.startsWith(item._id) // Match the period
            ).length,
            visitCount: customers.filter(c => 
              c.visitStatus && 
              !c.isPendingApproval &&
              c.createdAt.startsWith(item._id)
            ).length
          }));
        setData(filteredData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchStatusCounts();
}, [period, customers]); // Add customers to dependencies

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const buttonStyle = (selected) => ({
    backgroundColor: period === selected ? "#0891b2" : "#fff",
    borderColor: "#0891b2",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <>
          <Text style={styles.welcome}>Welcome, {userName || "User"}!</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity style={buttonStyle("daily")} onPress={() => changePeriod("daily")}>
              <Text style={{ color: period === "daily" ? "#fff" : "#0891b2" }}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("weekly")} onPress={() => changePeriod("weekly")}>
              <Text style={{ color: period === "weekly" ? "#fff" : "#0891b2" }}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("monthly")} onPress={() => changePeriod("monthly")}>
              <Text style={{ color: period === "monthly" ? "#fff" : "#0891b2" }}>Montly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("yearly")} onPress={() => changePeriod("yearly")}>
              <Text style={{ color: period === "yearly" ? "#fff" : "#0891b2" }}>Yearly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>
                {period.charAt(0).toUpperCase() + period.slice(1)} Status Counts
              </Text>
              {data.length > 0 ? (
                <LineChart
                  data={{
                    labels: data.map((item) => item.label),
                    datasets: [
                      {
                        data: data.map((item) => item.paidCount),
                        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        strokeWidth: 2,
                      },
                      {
                        data: data.map((item) => item.visitCount),
                        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                    legend: ["Paid", "Visited"],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  yAxisInterval={1}
                  fromZero={true}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
                  }}
                  bezier
                />
              ) : (
                <Text style={styles.noDataText}>No data available for the selected period.</Text>
              )}
            </View>

            <View style={styles.chart}>
              <Text style={styles.chartTitle}>
                Total Customers: {totalCustomers}
              </Text>
              <PieChart
                data={pieData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <View style={styles.legendContainer}>
                {pieData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>
                      {item.name}: {item.population}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.spaceBottom} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0891b2",
    textAlign: "center",
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    color: "#0e7490",
    textAlign: "center",
    fontWeight: "600",
  },
  periodButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chart: {
    marginBottom: 30,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 3,
    shadowColor: "#0891b2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0c4a6e",
    textAlign: "center",
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: 16,
  },
  spaceBottom: {
    height: 100,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
    backgroundColor: "#f0f9ff",
    padding: 8,
    borderRadius: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0891b2",
  },
  noDataText: {
    color: "#64748b",
    textAlign: "center",
    marginVertical: 20,
  },
});