import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateProfile({ userId }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data to populate the form
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.data;
        setFormData({ name: user.name, email: user.email });
        setPreviewImage(user.profileImage);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (profileImage) formDataToSend.append('image', profileImage);

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || 'Profile updated successfully!');

      // Show confirmation dialog
      if (window.confirm('Profile updated successfully! Click OK to go to the dashboard.')) {
        navigate('/dashboard'); // Redirect to the dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Profile Image</label>
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mb-2 w-32 h-32 rounded-full mx-auto" />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
    </div>
  );
}

export default UpdateProfile;