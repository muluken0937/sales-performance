// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from "react-native";
// import { PieChart, BarChart } from "react-native-chart-kit"; // Ensure both charts are imported
// import axiosInstance from "../hooks/axiosInstance";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure AsyncStorage is imported

// export default function Dashboard() {
//   const [customers, setCustomers] = useState([]);
//   const [data, setData] = useState([]);
//   const [period, setPeriod] = useState("daily");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalCustomers, setTotalCustomers] = useState(0);
//   const [pieData, setPieData] = useState([]);
//   const [userName, setUserName] = useState(""); // State to hold user name

//   // Fetch logged-in user name from AsyncStorage
//   useEffect(() => {
//     const fetchUserName = async () => {
//       const storedUserName = await AsyncStorage.getItem("userName");
//       if (storedUserName) {
//         setUserName(storedUserName);
//       }
//     };

//     fetchUserName();
//   }, []);

//   // Fetch all customers
//   useEffect(() => {
//     const fetchAllCustomers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axiosInstance.get("/customers/");
//         if (response.data.success) {
//           setCustomers(response.data.data);
//           calculateStatusCounts(response.data.data);
//         } else {
//           throw new Error(response.data.message || "Unknown error occurred");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllCustomers();
//   }, []);

//   // Calculate status counts for pie chart
//   const calculateStatusCounts = (data) => {
//     const counts = { paid: 0, visited: 0, both: 0, neither: 0 };

//     data.forEach(item => {
//       const { paidStatus, visitStatus, isPendingApproval } = item;

//       if (!paidStatus && !visitStatus && !isPendingApproval) counts.neither += 1;
//       else if (paidStatus && !visitStatus && !isPendingApproval) counts.paid += 1;
//       else if (!paidStatus && visitStatus && !isPendingApproval) counts.visited += 1;
//       else if (paidStatus && visitStatus && !isPendingApproval) counts.both += 1;
//     });

//     setTotalCustomers(data.length);
//     setPieData([
//       { name: "Paid", population: counts.paid, color: "#4caf50" }, // Green
//       { name: "Visited", population: counts.visited, color: "#2196f3" }, // Blue
//       { name: "Both", population: counts.both, color: "#ff9800" }, // Orange
//       { name: "Neither", population: counts.neither, color: "#f44336" }, // Red
//     ]);
//   };

//   // Fetch status counts for bar chart
//   useEffect(() => {
//     const fetchStatusCounts = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await axiosInstance.get(`/customers/status-counts?period=${period}`);
//         if (response.data.success) {
//           setData(
//             response.data.data.map(item => ({
//               label: item._id,
//               visitCount: item.visitCount,
//               paidCount: item.paidCount,
//             }))
//           );
//         } else {
//           throw new Error(response.data.message || "Unknown error occurred");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStatusCounts();
//   }, [period]);

//   // Function to change the period
//   const changePeriod = (newPeriod) => {
//     setPeriod(newPeriod);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Dashboard</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : error ? (
//         <Text style={styles.errorText}>Error: {error}</Text>
//       ) : (
//         <>
//           <Text style={styles.welcome}>Welcome, {userName || "User"}!</Text>
//           <View style={styles.periodButtons}>
//             <Button title="Daily" onPress={() => changePeriod("daily")} />
//             <Button title="Weekly" onPress={() => changePeriod("weekly")} />
//             <Button title="Monthly" onPress={() => changePeriod("monthly")} />
//           </View>
//           <View style={styles.chartContainer}>
//             {/* Bar Chart */}
//             <View style={styles.chart}>
//               <Text style={styles.chartTitle}>{period.charAt(0).toUpperCase() + period.slice(1)} Status Counts</Text>
//               {data.length > 0 ? (
//                 <BarChart
//                 data={{
//                   labels: data.map(item => item.label), // Labels for the x-axis
//                   datasets: [
//                     {
//                       data: data.map(item => item.paidCount), // Paid count for the first dataset
//                       color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for paid
//                     },
//                     {
//                       data: data.map(item => item.visitCount), // Visit count for the second dataset
//                       color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`, // Red for visited
//                     },
//                   ],
//                 }}
//                 width={400}
//                 height={220}
//                 yAxisInterval={1}
//                 chartConfig={{
//                   backgroundColor: "#fff",
//                   backgroundGradientFrom: "#fff",
//                   backgroundGradientTo: "#fff",
//                   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   strokeWidth: 2,
//                   barPercentage: 0.5, // Bar width
//                 }}
//                 fromZero={true} // Ensures the chart starts from zero
//               />
              
//               ) : (
//                 <Text>No data available for the selected period.</Text>
//               )}
//             </View>

//             {/* Pie Chart */}
//             <View style={styles.chart}>
//               <Text style={styles.chartTitle}>Total Customers: {totalCustomers}</Text>
//               <PieChart
//                 data={pieData}
//                 width={400}
//                 height={220}
//                 chartConfig={{
//                   backgroundColor: "#fff",
//                   backgroundGradientFrom: "#fff",
//                   backgroundGradientTo: "#fff",
//                   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   strokeWidth: 2,
//                   barPercentage: 0.5,
//                 }}
//                 accessor="population"
//                 backgroundColor="transparent"
//               />
//             </View>
//           </View>

//           {/* Space for Tab Bar */}
//           <View style={styles.spaceBottom} />
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f4f4f0",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   welcome: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   periodButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   chartContainer: {
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   chart: {
//     marginBottom: 20,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   errorText: {
//     color: "red",
//   },
//   spaceBottom: {
//     height: 100, // Adjust height as needed for the Tab Bar
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import axiosInstance from "../hooks/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function Dashboard() {
  const navigation = useNavigation(); // Access navigation for screen navigation
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

  useEffect(() => {
    const fetchStatusCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/customers/status-counts?period=${period}`
        );
        if (response.data.success) {
          setData(
            response.data.data.map((item) => ({
              label: item._id,
              visitCount: item.visitCount,
              paidCount: item.paidCount,
            }))
          );
        } else {
          throw new Error(response.data.message || "Unknown error occurred");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, [period]);

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.customerListButton}
          onPress={() => navigation.navigate("CustomerList")} 
        >
          <Text style={styles.customerListButtonText}>Customer List</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <>
          <Text style={styles.welcome}>Welcome, {userName || "User"}!</Text>
          <View style={styles.periodButtons}>
            <Button title="Daily" onPress={() => changePeriod("daily")} />
            <Button title="Weekly" onPress={() => changePeriod("weekly")} />
            <Button title="Monthly" onPress={() => changePeriod("monthly")} />
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>
                {period.charAt(0).toUpperCase() + period.slice(1)} Status Counts
              </Text>
              {data.length > 0 ? (
                <BarChart
                  data={{
                    labels: data.map((item) => item.label),
                    datasets: [
                      {
                        data: data.map((item) => item.paidCount),
                        color: (opacity = 1) =>
                          `rgba(76, 175, 80, ${opacity})`,
                      },
                      {
                        data: data.map((item) => item.visitCount),
                        color: (opacity = 1) =>
                          `rgba(255, 87, 34, ${opacity})`,
                      },
                    ],
                  }}
                  width={400}
                  height={220}
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                    barPercentage: 0.5,
                  }}
                  fromZero={true}
                />
              ) : (
                <Text>No data available for the selected period.</Text>
              )}
            </View>
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>
                Total Customers: {totalCustomers}
              </Text>
              <PieChart
                data={pieData}
                width={400}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                  barPercentage: 0.5,
                }}
                accessor="population"
                backgroundColor="transparent"
              />
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
    backgroundColor: "#f4f4f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  customerListButton: {
    backgroundColor: "#0aa7",
    padding: 10,
    borderRadius: 15,
  },
  customerListButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
  },
  spaceBottom: {
    height: 100,
  },
});
