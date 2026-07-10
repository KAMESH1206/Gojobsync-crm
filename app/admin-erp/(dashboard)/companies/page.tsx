"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" });

  const fetchData = () => { fetch("/api/admin/companies").then(r => r.json()).then(d => { setCompanies(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" }); setShowModal(true); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ companyName: c.companyName, contactPerson: c.contactPerson, email: c.email, phone: c.phone, address: c.address, industry: c.industry, website: c.website || "", status: c.status }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/companies", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/admin/companies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  const filtered = companies.filter(c => c.companyName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Plus size={16} /> Add Company
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Industry</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No companies found</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4"><div className="text-sm font-medium text-gray-800">{c.companyName}</div><div className="text-xs text-gray-400">{c.email}</div></td>
                <td className="p-4 text-sm text-gray-600">{c.contactPerson}</td>
                <td className="p-4 text-sm text-gray-600">{c.industry}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editId ? "Edit Company" : "Add Company"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
                <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
              </div>
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Industry" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Website (optional)" value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
