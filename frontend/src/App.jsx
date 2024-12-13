import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CustomersForm from './pages/customersForm';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './pages/Profile'; // Import Profile component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Clear stored user ID on logout
    setIsLoggedIn(false);
  };

  const AuthenticatedLayout = ({ children }) => (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-52">{children}</main>
      </div>
    </>
  );

  const loggedInUserId = localStorage.getItem('userId'); 

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      <Route path="/register" element={<RegisterUser />} />

      <Route path="/register-customer" element={<CustomersForm />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <UpdateProfile userId={loggedInUserId} />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile Page Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Profile userId={loggedInUserId} />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
