// import React, { useState } from "react";
// import { Tabs } from "expo-router";
// import TabBar from "../components/TabBar";
// import WelcomeScreen from "../screens/WelcomeScreen";
// import LoginScreen from "../screens/Login";

// const _layout = () => {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleContinueFromWelcome = () => {
//     console.log("Navigating from Welcome to Login");
//     setShowWelcome(false);
//   };

//   const handleLogin = () => {
//     console.log("Login successful, navigating to Tabs");
//     setIsLoggedIn(true);
//   };

//   if (showWelcome) {
//     return <WelcomeScreen onContinue={handleContinueFromWelcome} />;
//   }

//   if (!isLoggedIn) {
//     return <LoginScreen onLogin={handleLogin} />;
//   }

//   return (
//     <Tabs tabBar={(props) => <TabBar {...props} />}>
//       <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
//       <Tabs.Screen name="explore" options={{ title: "Explore" }} />
//       <Tabs.Screen name="profile" options={{ title: "Profile" }} />
//       <Tabs.Screen name="create" options={{ title: "Create" }} />
//     </Tabs>
//   );
// };

// export default _layout;
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import Navbar from "../components/Navbar";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/Login";
import UpdateProfile from "../screens/UpdateProfile"; 

const Stack = createStackNavigator();

const _layout = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleContinueFromWelcome = () => {
    console.log("Navigating from Welcome to Login");
    setShowWelcome(false);
  };

  const handleLogin = () => {
    console.log("Login successful, navigating to Tabs");
    setIsLoggedIn(true);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleContinueFromWelcome} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Stack.Navigator initialRouteName="Tabs">
      {/* Tab Navigator inside a Stack Navigator */}
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => (
          <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen
              name="index"
              options={{
                header: () => <Navbar />, // Use Navbar here
                title: "Dashboard",
              }}
            />
            <Tabs.Screen name="explore" options={{ title: "Explore" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
            <Tabs.Screen name="create" options={{ title: "Create" }} />
          </Tabs>
        )}
      </Stack.Screen>

      {/* Update Profile Screen */}
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{ title: "Update Profile" }}
      />
    </Stack.Navigator>
  );
};

export default _layout;
