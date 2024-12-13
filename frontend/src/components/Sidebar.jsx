import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-52 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4">
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
  );
}
