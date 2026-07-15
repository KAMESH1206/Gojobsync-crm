"use client";
import { useState, useEffect } from "react";
import { Users, Briefcase, Building, BarChart } from "lucide-react";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex items-center gap-3 mb-3"><div className="bg-blue-100 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div><span className="text-sm text-gray-500">Candidates</span></div><p className="text-3xl font-bold text-gray-800">{stats?.totalCandidates || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex items-center gap-3 mb-3"><div className="bg-indigo-100 p-2 rounded-lg"><Building className="w-5 h-5 text-[#0077B6]" /></div><span className="text-sm text-gray-500">Companies</span></div><p className="text-3xl font-bold text-gray-800">{stats?.totalCompanies || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex items-center gap-3 mb-3"><div className="bg-emerald-100 p-2 rounded-lg"><Briefcase className="w-5 h-5 text-emerald-600" /></div><span className="text-sm text-gray-500">Jobs</span></div><p className="text-3xl font-bold text-gray-800">{stats?.totalJobs || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex items-center gap-3 mb-3"><div className="bg-purple-100 p-2 rounded-lg"><BarChart className="w-5 h-5 text-purple-600" /></div><span className="text-sm text-gray-500">System Users</span></div><p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Candidate Growth</span><span className="font-medium">{stats?.totalCandidates || 0}</span></div><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min((stats?.totalCandidates || 0) * 2, 100)}%` }}></div></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Company Partnerships</span><span className="font-medium">{stats?.totalCompanies || 0}</span></div><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-[#03045E] h-3 rounded-full" style={{ width: `${Math.min((stats?.totalCompanies || 0) * 5, 100)}%` }}></div></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Job Listings</span><span className="font-medium">{stats?.totalJobs || 0}</span></div><div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${Math.min((stats?.totalJobs || 0) * 3, 100)}%` }}></div></div></div>
        </div>
      </div>
    </div>
  );
}
