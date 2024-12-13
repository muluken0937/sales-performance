// import { Link, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('userId');
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);

//     const userRole = localStorage.getItem('role');
//     setRole(userRole);
//   }, []);

//   const getRegisterLink = () => {
//     if (role === 'Admin') {
//       return '/register'; 
//     } else if (role === 'SalesManager') {
//       return '/register'; 
//     } else if (role === 'SalesUser') {
//       return '/register-customer'; 
//     }
//     return '/register'; 
//   };

//   return (
//     <nav className="bg-gray-600 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-white text-lg font-bold">Home</Link>
//         <div className="flex items-center ml-auto">
//           {isLoggedIn ? (
//             <>
//               <Link 
//                 to={getRegisterLink()} 
//                 className="text-white mr-4"
//               >
//                 Register {role === 'Admin' ? 'Manager' : role === 'SalesManager' ? 'SalesUser' : 'Customer'}
//               </Link>
//               <button 
//                 onClick={handleLogout} 
//                 className="text-white"
//                 aria-label="Logout"
//               >
//                 <FontAwesomeIcon icon={faSignOutAlt} />
//               </button>
//             </>
//           ) : (
//             <Link to="/login" className="text-white">Login</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userDetails, setUserDetails] = useState({
    role: localStorage.getItem("role"),
    name: localStorage.getItem("userName"),
    image: localStorage.getItem("userImage"), // Expecting null or image URL
  });

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    setUserDetails({
      role: localStorage.getItem("role"),
      name: localStorage.getItem("userName"),
      image: localStorage.getItem("userImage"),
      
    });
    
  }, []);

  const getRegisterLink = () => {
    if (userDetails.role === "Admin") return "/register";
    if (userDetails.role === "SalesManager") return "/register";
    if (userDetails.role === "SalesUser") return "/register-customer";
    return "/register";
  };

  const renderProfileImage = () => {
    if (userDetails.image) {
      const imageURL = `http://localhost:5000${userDetails.image}`;
      return (
        <img
          src={imageURL}
          alt="User Profile"
          className="h-10 w-10 rounded-full border border-gray-300"
        />
      );
    } else {
      const initials = userDetails.name
        ? userDetails.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
        : "?";
      return (
        <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
          <span className="text-white text-lg">{initials}</span>
        </div>
      );
    }
  };
  

  return (
    <nav className="ml-52 bg-white border-b border-gray-200 dark:bg-gray-200 dark:border-gray-700">
      <div className="max-w-full flex items-center justify-between p-2">
        {/* User Profile Section */}
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {renderProfileImage()}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {userDetails.name || "Unknown User"}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {userDetails.role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {isLoggedIn && (
            <Link
              to={getRegisterLink()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register{" "}
              {userDetails.role === "Admin"
                ? "Manager"
                : userDetails.role === "SalesManager"
                ? "SalesUser"
                : "Customer"}
            </Link>
          )}

          {isLoggedIn && (
            <div className="flex flex-col items-center space-y-2">
              {/* Notifications for SalesManager */}
              {userDetails.role === "SalesManager" && (
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative flex items-center text-yellow-500 dark:text-yellow-400"
                  aria-label="Notifications"
                >
                  <FontAwesomeIcon icon={faBell} className="text-lg" />
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full">
                    3
                  </span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center"
                aria-label="Logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <Link
              to="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
