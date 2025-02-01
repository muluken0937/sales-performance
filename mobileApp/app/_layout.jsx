
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import Navbar from "../components/Navbar";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/Login";
import UpdateProfile from "../screens/UpdateProfile";
import NotificationsScreen from "../screens/Notifications";
import CustomerList from "../screens/CustomerList";
import UpdateCustomer from "../screens/updateCustomer";
import Description from "../components/Description"; // Import the Description component

const Stack = createStackNavigator();

const _layout = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await AsyncStorage.getItem("role");
      setUserRole(role || "Guest");
    };

    fetchUserRole();
  }, []);

  const handleContinueFromWelcome = () => {
    setShowWelcome(false);
  };

  const handleLogin = async () => {
    setIsLoggedIn(true);
    const role = await AsyncStorage.getItem("role");
    setUserRole(role || "Guest");
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleContinueFromWelcome} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => (
          <Tabs tabBar={(props) => <TabBar {...props} userRole={userRole} />}>
            <Tabs.Screen
              name="index"
              options={{
                header: () => <Navbar onLogout={handleLogout} />,
                title: "Dashboard",
              }}
            />
            <Tabs.Screen
              name="explore"
              options={{
                header: () => <Navbar onLogout={handleLogout} />,
                title: "Customers",
              }}
            />
            <Tabs.Screen
              name="create"
              options={{
                header: () => <Navbar onLogout={handleLogout} />,
                title: "Add-User",
              }}
            />
            <Tabs.Screen
              name="CreateCustomer"
              options={{
                header: () => <Navbar onLogout={handleLogout} />,
                title: "Create",
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                header: () => <Navbar onLogout={handleLogout} />,
                title: "Profile",
              }}
            />
          </Tabs>
        )}
      </Stack.Screen>

      {/* Stack Screens */}
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{ title: "Update Profile" }}
      />
      <Stack.Screen
        name="UpdateCustomer"
        component={UpdateCustomer}
        options={{ title: "Edit Customer" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="CustomerList"
        component={CustomerList}
        options={{ title: "Customer List" }}
      />
      <Stack.Screen
        name="Description"
        component={Description}
        options={{ title: "Customer Description" }}
      />
    </Stack.Navigator>
  );
};

export default _layout;