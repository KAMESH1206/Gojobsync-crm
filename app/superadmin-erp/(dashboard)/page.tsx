"use client";
import { useState, useEffect } from "react";
import { Users, Briefcase, Building, DollarSign, Package, FileText } from "lucide-react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f172a] text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3 opacity-20"><DollarSign className="w-12 h-12" /></div>
          <p className="text-sm font-medium opacity-80 mb-1">Total Users</p>
          <span className="text-3xl font-bold">{stats?.totalUsers || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-blue-100 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCandidates || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Candidates</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-indigo-100 p-3 rounded-lg"><Building className="w-6 h-6 text-indigo-600" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCompanies || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Companies</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-emerald-100 p-3 rounded-lg"><Briefcase className="w-6 h-6 text-emerald-600" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalJobs || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><Package size={18} /> Packages</h2>
          <p className="text-3xl font-bold text-gray-800">{stats?.totalPackages || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Active pricing packages</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FileText size={18} /> Invoices</h2>
          <p className="text-3xl font-bold text-gray-800">{stats?.totalInvoices || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total invoices generated</p>
        </div>
      </div>
    </div>
  );
}
