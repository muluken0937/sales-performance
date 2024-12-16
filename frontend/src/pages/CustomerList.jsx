import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const role = localStorage.getItem("role");

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

  const handleStatusChange = async (customerId, statusType, value) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/customers/${customerId}/status`,
        { [statusType]: value },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        alert("Status updated and pending approval.");
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) => {
            if (cust._id === customerId) {
              return { ...cust, [statusType]: value, isPendingApproval: true };
            }
            return cust;
          })
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleCheckboxChange = (customerId, statusType) => {
    const customer = customers.find((cust) => cust._id === customerId);
    const newValue = !customer[statusType];
    handleStatusChange(customerId, statusType, newValue);
  };

  const isCheckboxDisabled = (customer, statusType) => {
    return customer.isPendingApproval && !(customer[statusType] === false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4">Paid Status</th>
              <th className="py-2 px-4">Visit Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-gray-700 cursor-pointer">
                <td className="py-2 px-4">{customer.name}</td>
                <td className="py-2 px-4">
                  <label
                    className={`inline-flex items-center ${
                      !customer.isPendingApproval && customer.paidStatus ? 'bg-green-900' : ''
                    } p-2 rounded`}
                  >
                    <input
                      type="checkbox"
                      checked={role === "SalesUser" ? customer.paidStatus : !customer.isPendingApproval && customer.paidStatus}
                      onChange={() => {
                        if (role === "SalesUser" || !customer.isPendingApproval) {
                          handleCheckboxChange(customer._id, "paidStatus");
                        }
                      }}
                      className={`form-checkbox h-5 w-5 ${customer.isPendingApproval ? "text-blue-600" : "text-blue-600"}`} 
                      disabled={isCheckboxDisabled(customer, "paidStatus")}
                    />
                  </label>
                </td>
                <td className="py-2 px-4">
                  <label
                    className={`inline-flex items-center ${
                      !customer.isPendingApproval && customer.visitStatus ? 'bg-green-900' : ''
                    } p-2 rounded`}
                  >
                    <input
                      type="checkbox"
                      checked={role === "SalesUser" ? customer.visitStatus : !customer.isPendingApproval && customer.visitStatus}
                      onChange={() => {
                        if (role === "SalesUser" || !customer.isPendingApproval) {
                          handleCheckboxChange(customer._id, "visitStatus");
                        }
                      }}
                      className={`form-checkbox h-5 w-5 ${customer.isPendingApproval ? "text-blue-600" : "text-blue-600"}`} 
                      disabled={isCheckboxDisabled(customer, "visitStatus")}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}