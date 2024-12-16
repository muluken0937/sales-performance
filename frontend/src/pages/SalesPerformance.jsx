import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesPerformance = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesUser, setSelectedSalesUser] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };

  // Extract unique sales users from customers
  const salesUsers = [...new Set(customers.map(customer => customer.createdBy.name))];

  const filteredCustomers = selectedSalesUser
    ? customers.filter(customer => customer.createdBy.name === selectedSalesUser)
    : customers;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-3xl font-bold">Sales Performance</h2>
        <span className="text-lg font-semibold">{filteredCustomers.length} Customers</span>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Select Sales User:</label>
        <select
          className="border rounded px-4 py-2 w-full md:w-auto"
          value={selectedSalesUser}
          onChange={(e) => setSelectedSalesUser(e.target.value)}
        >
          <option value="">All Users</option>
          {salesUsers.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105 cursor-pointer hover:shadow-xl"
            onClick={() => handleCustomerClick(customer)}
          >
            <h3 className="text-xl font-semibold">{customer.name}</h3>
            <p className="text-gray-200"><strong>Email:</strong> {customer.email}</p>
            <div className="mt-4 border-t border-gray-300 pt-2">
              <span className="text-sm text-gray-200">Click for more details</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <CustomerDetail customer={selectedCustomer} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

const CustomerDetail = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">{customer.name}</h2>
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Email:</strong> {customer.email}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {customer.phoneNumber}</p>
          <p className="text-gray-700"><strong>Location:</strong> {customer.location}</p>
          <p className="text-gray-700"><strong>Description:</strong> {customer.description || "N/A"}</p>
          <p className={`text-gray-700 ${customer.paidStatus ? "font-semibold text-green-600" : "text-red-600"}`}>
            <strong>Paid Status:</strong> {customer.paidStatus ? "Paid" : "Unpaid"}
          </p>
          <p className={`text-gray-700 ${customer.visitStatus ? "font-semibold text-green-600" : "text-red-600"}`}>
            <strong>Visit Status:</strong> {customer.visitStatus ? "Visited" : "Not Visited"}
          </p>
          <p className="text-gray-700">
            <strong>Created By:</strong> {customer.createdBy.name} (Email: {customer.createdBy.email})
          </p>
          <p className="text-gray-700">
            <strong>Created At:</strong> {new Date(customer.createdAt).toLocaleString()}
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SalesPerformance;