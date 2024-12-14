import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-52 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Sales</h1>
      <nav className="space-y-4">
        {/* Dashboard */}
        <a href="/dashboard" className="flex items-center p-2 bg-blue-800 rounded hover:bg-blue-700">
          <i className="fas fa-tachometer-alt"></i>
          <span className="ml-4">Dashboard</span>
        </a>

        {/* Customer List */}
        <a href="/customer-list" className="flex items-center p-2 hover:bg-gray-800 rounded">
          <i className="fas fa-users"></i>
          <span className="ml-4">Customer List</span>
        </a>

        {/* Contacts */}
        <a href="/contacts" className="flex items-center p-2 hover:bg-gray-800 rounded">
          <i className="fas fa-address-book"></i>
          <span className="ml-4">Contacts</span>
        </a>

        {/* Accounts */}
        <a href="/accounts" className="flex items-center p-2 hover:bg-gray-800 rounded">
          <i className="fas fa-briefcase"></i>
          <span className="ml-4">Accounts</span>
        </a>

        {/* Opportunities */}
        <a href="/opportunities" className="flex items-center p-2 hover:bg-gray-800 rounded">
          <i className="fas fa-chart-line"></i>
          <span className="ml-4">Opportunities</span>
        </a>
      </nav>
    </aside>
  );
}