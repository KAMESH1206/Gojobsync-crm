"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, duration: 30, jobPosts: 5, resumeViews: 50 });

  const fetchData = () => { fetch("/api/admin/packages").then(r => r.json()).then(d => { setPackages(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ name: "", price: 0, duration: 30, jobPosts: 5, resumeViews: 50 }); setShowModal(true); };
  const openEdit = (p: any) => { setEditId(p.id); setForm({ name: p.name, price: p.price, duration: p.duration, jobPosts: p.jobPosts, resumeViews: p.resumeViews }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/packages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch("/api/admin/packages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Add Package</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? <p className="col-span-full text-center text-gray-400 py-8">No packages yet</p> : packages.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <p className="text-3xl font-bold text-[#0f172a] mt-3">₹{p.price}<span className="text-sm font-normal text-gray-500">/{p.duration} days</span></p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>✅ {p.jobPosts} Job Posts</p>
              <p>✅ {p.resumeViews} Resume Views</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(p)} className="flex-1 py-2 text-center border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"><Edit size={14} className="inline mr-1" />Edit</button>
              <button onClick={() => handleDelete(p.id)} className="py-2 px-3 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">{editId ? "Edit" : "Add"} Package</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Package Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Duration (days)</label><input type="number" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Job Posts</label><input type="number" value={form.jobPosts} onChange={e => setForm({...form, jobPosts: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Resume Views</label><input type="number" value={form.resumeViews} onChange={e => setForm({...form, resumeViews: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
