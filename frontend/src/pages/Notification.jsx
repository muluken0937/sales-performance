import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Notification() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { isPendingApproval: true },
        });

        const approvals = response.data.data.filter(customer =>
          customer.isPendingApproval && (customer.paidStatus || customer.visitStatus)
        );

        setPendingApprovals(approvals);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  const handleApproval = async (customerId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/customers/${customerId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        alert("Status approved successfully");
        setPendingApprovals((prev) =>
          prev.filter((customer) => customer._id !== customerId)
        );
      }
    } catch (error) {
      console.error("Error approving status:", error);
      alert("Failed to approve status.");
    }
  };

  if (loading) return <p className="text-center">Loading pending approvals...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {pendingApprovals.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Pending Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-700">
                  <td className="py-2 px-4">{customer.name}</td>
                  <td className="py-2 px-4">{customer.email}</td>
                  <td className="py-2 px-4">
                    {customer.paidStatus && "Paid, "}
                    {customer.visitStatus && "Visited"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleApproval(customer._id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}