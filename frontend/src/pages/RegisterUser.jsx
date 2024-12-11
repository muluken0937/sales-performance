// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000/api', // Adjust to match your backend URL
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // Retrieve the token from localStorage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`; // Add token to the request headers
//   }
//   return config;
// });

// export default function RegisterUser() {
//   const [userRole, setUserRole] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [registerRole, setRegisterRole] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role'); // Get role from localStorage
//     setUserRole(storedRole); // Set the current user's role
//     const roles = getAvailableRoles(storedRole);
//     setRegisterRole(roles[0] || ''); // Default to the first available role
//   }, []);

//   const getAvailableRoles = (role) => {
//     if (role === 'Admin') {
//       return ['SalesManager', 'SalesUser']; 
//     } else if (role === 'SalesManager') {
//       return ['SalesUser']; 
//     }
//     return [];
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axiosInstance.post('/users', {
//         name,
//         email,
//         password,
//         role: registerRole, // Pass the selected role
//       });

//       setMessage(`${registerRole} registered successfully.`);
//       resetForm();
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Registration failed';
//       setMessage(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setName('');
//     setEmail('');
//     setPassword('');
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-semibold mb-4">Register {registerRole}</h1>
//       {userRole === 'SalesUser' ? (
//         <p className="text-red-600">You are not authorized to register new users.</p>
//       ) : (
//         <form onSubmit={handleRegister} className="space-y-4">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Name"
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />

//           <div className="p-2 border border-gray-300 rounded">
//             <label className="font-semibold block mb-2">Role</label>
//             <select
//               value={registerRole}
//               onChange={(e) => setRegisterRole(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             >
//               {getAvailableRoles(userRole).map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             className={`w-full text-white py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
//             disabled={loading}
//           >
//             {loading ? <span className="animate-spin">⏳</span> : 'Register'}
//           </button>

//           {message && (
//             <p className={`mt-2 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
//               {message}
//             </p>
//           )}
//         </form>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to match your backend URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to the request headers
  }
  return config;
});

export default function RegisterUser() {
  const [userRole, setUserRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [image, setImage] = useState(null); 
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('role'); 
    setUserRole(storedRole); 
    const roles = getAvailableRoles(storedRole);
    setRegisterRole(roles[0] || ''); 
  }, []);

  const getAvailableRoles = (role) => {
    if (role === 'Admin') {
      return ['SalesManager', 'SalesUser'];
    } else if (role === 'SalesManager') {
      return ['SalesUser'];
    }
    return [];
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', registerRole);
      if (image) {
        formData.append('image', image); 
      }

      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      setMessage(`${registerRole} registered successfully.`);
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Register {registerRole}</h1>
      {userRole === 'SalesUser' ? (
        <p className="text-red-600">You are not authorized to register new users.</p>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <div className="p-2 border border-gray-300 rounded">
            <label className="font-semibold block mb-2">Role</label>
            <select
              value={registerRole}
              onChange={(e) => setRegisterRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {getAvailableRoles(userRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2 border border-gray-300 rounded">
            <label className="font-semibold block mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? <span className="animate-spin">⏳</span> : 'Register'}
          </button>

          {message && (
            <p className={`mt-2 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
