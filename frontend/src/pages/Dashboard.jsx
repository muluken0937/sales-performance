import React, { useState } from "react";

export default function Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">


      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">All Open Leads</h2>
          <div>
            <button
              onClick={toggleSidebar}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Options
            </button>
            <button className="ml-2 bg-gray-300 px-4 py-2 rounded">
              Import
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white rounded shadow p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Company</th>
                <th className="text-left">State/Province</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Focus on the right leads
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
