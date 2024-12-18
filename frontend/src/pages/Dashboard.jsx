
import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { BarChart } from "@mui/x-charts";

const size = {
  width: 400,
  height: 300,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]); 
  const [data, setData] = useState([]); 
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pieData, setPieData] = useState([]);

  const userName = localStorage.getItem("userName") || "User"; 

  // Fetch all customers
  useEffect(() => {
    const fetchAllCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/customers/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setCustomers(result.data);
          calculateStatusCounts(result.data); // Calculate counts when data is fetched
        } else {
          throw new Error(result.message || "Unknown error occurred");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomers();
  }, []);

  // Calculate status counts for pie chart
  const calculateStatusCounts = (data) => {
    const counts = {
      paid: 0,
      visited: 0,
      both: 0,
      neither: 0,
    };
  
    data.forEach(item => {
      const { paidStatus, visitStatus, isPendingApproval } = item;
  
      // Check for neither first
      if (!paidStatus && !visitStatus && !isPendingApproval) {
        counts.neither += 1; 
      } else if (paidStatus && !visitStatus && !isPendingApproval) {
        counts.paid += 1; 
      } else if (!paidStatus && visitStatus && !isPendingApproval) {
        counts.visited += 1; 
      } else if (paidStatus && visitStatus && !isPendingApproval) {
        counts.both += 1; 
      }
    });
  
    setTotalCustomers(data.length); 
    setPieData([
      { value: counts.paid, label: 'Paid' },
      { value: counts.visited, label: 'Visited' },
      { value: counts.both, label: 'Both' },
      { value: counts.neither, label: 'Neither' },
    ]);
  };
  // Fetch status counts for bar chart
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
    <div className="flex flex-col h-screen">
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

        <div className="flex flex-col lg:flex-row">
          {/* Pie Chart */}
          <div className="w-full lg:w-1/3 mb-4 lg:mr-14">
            <h3 className="text-lg text-red-600 font-semibold mb-4">Total Customers</h3>
            <PieChart series={[{ data: pieData, innerRadius: 80 }]} {...size}>
              <PieCenterLabel>{totalCustomers}</PieCenterLabel>
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
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
                legend={{ position: { vertical: 'top', horizontal: 'middle' }}}
              />
            ) : (
              <p className="text-gray-500">No data available for the selected period.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}