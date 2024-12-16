import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('http://localhost:5000${user?.profileImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="container mx-auto p-4 relative z-10">
        <h1 className="text-xl font-bold text-white mb-4">Profile</h1>

        <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md mx-auto">
          {user.profileImage && (
            <div className="relative w-40 h-40 rounded-full border-4 border-white overflow-hidden">
              <img
                src={`http://localhost:5000${user.profileImage}`}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="text-center">
            <p className="text-lg">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          <button
            onClick={() => navigate('/update-profile')}
            className="mt-4 w-full px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update Profile
          </button>

          <button
            onClick={handleCancel}
            className="mt-2 w-full px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;