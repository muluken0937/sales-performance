import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Retrieve the user's name from local storage
  const userName = localStorage.getItem("userName") || "User"; // Fallback to "User"

  useEffect(() => {
    const fetchStatusCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5000/api/customers/status-counts?period=${period}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setData(
            result.data.map((item) => ({
              label: item._id,
              visitCount: item.visitCount,
              paidCount: item.paidCount,
            }))
          );
        } else {
          throw new Error(result.message || "Unknown error occurred");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, [period]);

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </header>

        {/* Welcome Message */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Welcome, {userName}!</h3>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {period.charAt(0).toUpperCase() + period.slice(1)} Status Counts
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : data.length > 0 ? (
            <BarChart
              xAxis={[{ data: data.map((item) => item.label), scaleType: "band" }]}
              series={[
                { data: data.map((item) => item.visitCount), label: "Visits" },
                { data: data.map((item) => item.paidCount), label: "Payments" },
              ]}
              height={300}
              legend={{ position: "top" }}
            />
          ) : (
            <p className="text-gray-500">No data available for the selected period.</p>
          )}
        </div>
      </main>
    </div>
  );
}