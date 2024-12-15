import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from './components/NavBar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import Dashboard from './pages/Dashboard';
import CustomersForm from './pages/customersForm';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './pages/Profile'; 
import CustomerList from './pages/CustomerList'; 
import Notification from './pages/Notification';
import SalesPerformance from './pages/SalesPerformance'; // Import SalesPerformance

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  const loggedInUserId = localStorage.getItem('userId');

  return (
    <>
      {/* Render Navbar and Sidebar only if not on the login page */}
      {location.pathname !== '/login' && (
        <>
          <Navbar onLogout={handleLogout} />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-52">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register-customer"
                  element={
                    <ProtectedRoute>
                      <CustomersForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update-profile"
                  element={
                    <ProtectedRoute>
                      <UpdateProfile userId={loggedInUserId} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile userId={loggedInUserId} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-list"
                  element={
                    <ProtectedRoute>
                      <CustomerList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales-performance" // Add route for SalesPerformance
                  element={
                    <ProtectedRoute>
                      <SalesPerformance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notification />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </>
      )}
      
      {location.pathname === '/login' && <Login onLogin={handleLogin} />}
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}