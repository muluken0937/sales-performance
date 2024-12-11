import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const getRegisterLink = () => {
    if (role === 'Admin') {
      return '/register'; 
    } else if (role === 'SalesManager') {
      return '/register'; 
    } else if (role === 'SalesUser') {
      return '/register-customer'; 
    }
    return '/register'; 
  };

  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Home</Link>
        <div className="flex items-center ml-auto">
          {isLoggedIn ? (
            <>
              <Link 
                to={getRegisterLink()} 
                className="text-white mr-4"
              >
                Register {role === 'Admin' ? 'Manager' : role === 'SalesManager' ? 'SalesUser' : 'Customer'}
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-white"
                aria-label="Logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}