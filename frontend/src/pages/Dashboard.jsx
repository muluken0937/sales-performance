import React from "react";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8">Sales</h1>
        <nav className="space-y-4">
          <a href="#" className="flex items-center p-2 bg-blue-800 rounded">
            <span className="ml-4">Leads</span>
          </a>
          <a href="#" className="flex items-center p-2">
            <span className="ml-4">Contacts</span>
          </a>
          <a href="#" className="flex items-center p-2">
            <span className="ml-4">Accounts</span>
          </a>
          <a href="#" className="flex items-center p-2">
            <span className="ml-4">Opportunities</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">All Open Leads</h2>
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              New
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
