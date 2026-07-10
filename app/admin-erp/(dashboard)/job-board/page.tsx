"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Search } from "lucide-react";

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    fetch("/api/admin/jobs").then(r => r.json()).then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false); });
  };
  useEffect(() => { fetchJobs(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/jobs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchJobs();
  };

  const filtered = jobs.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.client?.companyName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No jobs found</td></tr>
            ) : filtered.map(job => (
              <tr key={job.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-800">{job.title}</td>
                <td className="p-4 text-sm text-gray-600">{job.client?.companyName || "N/A"}</td>
                <td className="p-4 text-sm text-gray-600">{job.location}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' : job.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {job.status !== 'open' && (
                      <button onClick={() => updateStatus(job.id, "open")} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    {job.status !== 'closed' && (
                      <button onClick={() => updateStatus(job.id, "closed")} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                        <XCircle size={14} /> Close
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
