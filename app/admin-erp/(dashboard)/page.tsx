"use client";
import { useState, useEffect } from "react";
import { Users, Briefcase, Building, Clock } from "lucide-react";

export default function AdminERPDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCandidates || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Candidates</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg"><Building className="w-6 h-6 text-indigo-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCompanies || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Partner Companies</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-lg"><Clock className="w-6 h-6 text-amber-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-800">{stats?.pendingJobs || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Pending Approvals</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg"><Briefcase className="w-6 h-6 text-emerald-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalJobs || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Jobs Posted</p>
        </div>
      </div>
    </div>
  );
}
