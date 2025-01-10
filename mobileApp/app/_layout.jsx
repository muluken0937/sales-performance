

// import React, { useState } from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { Tabs } from "expo-router";
// import TabBar from "../components/TabBar";
// import Navbar from "../components/Navbar";
// import WelcomeScreen from "../screens/WelcomeScreen";
// import LoginScreen from "../screens/Login";
// import UpdateProfile from "../screens/UpdateProfile";
// import NotificationsScreen from "../screens/Notifications";
// import CustomerList from "../screens/CustomerList"; 

// const Stack = createStackNavigator();

// const _layout = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleContinueFromWelcome = () => {
//     setShowWelcome(false);
//   };

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   if (showWelcome) {
//     return <WelcomeScreen onContinue={handleContinueFromWelcome} />;
//   }

//   if (!isLoggedIn) {
//     return <LoginScreen onLogin={handleLogin} />;
//   }

//   return (
//     <Stack.Navigator initialRouteName="Tabs">
//       <Stack.Screen name="Tabs" options={{ headerShown: false }}>
//         {() => (
//           <Tabs tabBar={(props) => <TabBar {...props} />}>
//             <Tabs.Screen
//               name="index"
//               options={{
//                 header: () => <Navbar onLogout={handleLogout} />, // Pass handleLogout
//                 title: "Dashboard",
//               }}
//             />
//             <Tabs.Screen name="explore" options={{ title: "Explore" }} />
//             <Tabs.Screen name="profile" options={{ title: "Profile" }} />
//             <Tabs.Screen name="create" options={{ title: "Create" }} />
//             <Tabs.Screen
//               name="CreateCustomer"
//               options={{ title: "Customer" }}
//             />
//           </Tabs>
//         )}
//       </Stack.Screen>
//       <Stack.Screen
//         name="UpdateProfile"
//         component={UpdateProfile}
//         options={{ title: "Update Profile" }}
//       />
//       <Stack.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{ title: "Notifications" }}
//       />
//       <Stack.Screen
//         name="CustomerList"
//         component={CustomerList} 
//         options={{ title: "Customer List" }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default _layout;


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

const Stack = createStackNavigator();

const _layout = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await AsyncStorage.getItem("userRole"); 
      setUserRole(role || "Guest"); 
    };

    fetchUserRole();
  }, []);

  const handleContinueFromWelcome = () => {
    setShowWelcome(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
            <Tabs.Screen name="explore" options={{ title: "Explore" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
            <Tabs.Screen name="create" options={{ title: "Create" }} />
            <Tabs.Screen
              name="CreateCustomer"
              options={{ title: "Customer" }}
            />
          </Tabs>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{ title: "Update Profile" }}
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
    </Stack.Navigator>
  );
};

export default _layout;
