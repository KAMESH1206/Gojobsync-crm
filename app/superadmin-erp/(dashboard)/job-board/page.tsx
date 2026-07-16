"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Eye, X } from "lucide-react";

export default function SAJobBoardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const fetchJobs = () => { fetch("/api/admin/jobs").then(r => r.json()).then(d => { setJobs(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchJobs(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/jobs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchJobs();
    if (selectedJob?.id === id) {
      setSelectedJob({ ...selectedJob, status });
    }
  };

  const filtered = jobs.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Title</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Company</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Location</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">No jobs</td></tr> : filtered.map(j => (
              <tr key={j.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedJob(j)}>
                <td className="p-4 text-sm font-medium text-gray-800">{j.title}</td>
                <td className="p-4 text-sm text-gray-600">{j.client?.companyName || "N/A"}</td>
                <td className="p-4 text-sm text-gray-600">{j.location}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${j.status === 'open' ? 'bg-green-100 text-green-700' : j.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{j.status}</span></td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedJob(j)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"><Eye size={14} /> View</button>
                    {j.status !== 'open' && <button onClick={() => updateStatus(j.id, "open")} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100"><CheckCircle size={14} /> Approve</button>}
                    {j.status !== 'closed' && <button onClick={() => updateStatus(j.id, "closed")} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"><XCircle size={14} /> Close</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h3>
                <p className="text-gray-600 text-sm font-medium">{selectedJob.client?.companyName || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedJob.status === 'open' ? 'bg-green-100 text-green-700' : selectedJob.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedJob.status}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-sm font-medium text-gray-800">{selectedJob.location || "Not specified"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Experience</span>
                  <span className="text-sm font-medium text-gray-800">{selectedJob.experience || "Not specified"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Salary Range</span>
                  <span className="text-sm font-medium text-gray-800">{selectedJob.salaryRange || "Negotiable"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Openings</span>
                  <span className="text-sm font-medium text-gray-800">{selectedJob.positions || "1"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Posted Date</span>
                  <span className="text-sm font-medium text-gray-800">{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Job Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description || "No description provided."}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let skills: string[] = [];
                    try {
                      skills = typeof selectedJob.skills === 'string' ? JSON.parse(selectedJob.skills) : selectedJob.skills;
                      if (!Array.isArray(skills)) skills = [selectedJob.skills];
                    } catch (e) {
                      if (selectedJob.skills) skills = [selectedJob.skills];
                    }
                    return skills && skills.length > 0 ? skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{s}</span>
                    )) : <span className="text-sm text-gray-500">Not specified</span>;
                  })()}
                </div>
              </div>

            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
              {selectedJob.status !== 'open' && (
                <button onClick={() => updateStatus(selectedJob.id, "open")} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Approve Job</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
